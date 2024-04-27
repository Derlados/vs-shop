import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../services/products/prodcuts.service";
import { IProduct } from "../../types/magento/IProduct";
import catalogStore from "../catalog/catalog.store";

class ProductStore {
    public productStatus: "initial" | "loading" | "loading-related" | "success" | "error";
    public relatedStatus: "initial" | "loading" | "success" | "error";
    public product: IProduct | null;
    public relatedProducts: IProduct[];

    constructor() {
        makeAutoObservable(this);
        this.productStatus = "initial";
        this.product = null;
    }

    get category() {
        const categoryId = this.product?.extension_attributes.category_links[0].category_id || 0;
        const category = catalogStore.categoryList.find(category => category.id === Number(categoryId));

        return category;
    }

    async loadProduct(sku: string) {
        runInAction(() => this.productStatus = "loading");

        try {
            const product = await prodcutsService.getProductBySku(sku);

            runInAction(() => {
                this.product = product;
                this.productStatus = product ? "success" : "error";
            });
        } catch (error) {
            runInAction(() => this.productStatus = "error");
        }
    }

    async loadRelatedProducts() {
        if (!this.product) return;

        runInAction(() => this.relatedStatus = "loading");

        try {
            const relatedProducts = await prodcutsService.getRelatedProducts(this.product.sku);
            runInAction(() => {
                this.relatedProducts = relatedProducts;
                this.relatedStatus = "success";
            });
        } catch (error) {
            runInAction(() => this.relatedStatus = "error");
        }
    }

    clear() {
        this.product = null;
        this.productStatus = "initial";
    }
}

export default new ProductStore();