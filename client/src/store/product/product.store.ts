import { makeAutoObservable } from "mobx";
import productsService from "../../services/products/products.service";
import { IProduct } from "../../types/IProduct";

enum ProductStatus {
    initial, loading, failure, success
}

class ProductStore {
    public product?: IProduct;
    public relatedProducts: IProduct[];
    public status: ProductStatus;

    constructor() {
        makeAutoObservable(this);
        this.relatedProducts = [];
        this.status = ProductStatus.initial;
    }

    async fetchProductById(id: number) {
        this.status = ProductStatus.loading;
        try {
            this.product = await productsService.getProductById(id);
            this.status = ProductStatus.success;
        } catch (e) {
            this.status = ProductStatus.failure;
        }
    }

    async fetchRelatedProducts(product: IProduct, maxProducts: number) {
        this.status = ProductStatus.loading;
        try {
            const products = await productsService.getProductsByCategory(product.categoryId, { brands: [product.brand] });
            const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
            this.relatedProducts = shuffledProducts.slice(0, maxProducts);

            this.status = ProductStatus.success;
        } catch (e) {
            this.status = ProductStatus.failure;
        }
    }
}

export default new ProductStore();