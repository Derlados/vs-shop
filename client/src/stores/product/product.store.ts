import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../services/products/prodcuts.service";
import { IProduct } from "../../types/magento/IProduct";
import catalogStore from "../catalog/catalog.store";
import shopStore from "../shop/shop.store";

class ProductStore {
    public status: "initial" | "loading" | "success" | "error";
    public product: IProduct | null;
    public relatedProducts: IProduct[];

    constructor() {
        makeAutoObservable(this);
        this.status = "initial";
        this.product = null;
    }

    get category() {
        const categoryId = this.product?.extension_attributes.category_links[0].category_id || 0;
        const category = catalogStore.categoryList.find(category => category.id === Number(categoryId));

        return category;
    }

    async loadProduct(sku: string) {
        runInAction(() => this.status = "loading");

        try {
            const product = await prodcutsService.getProductBySku(sku);

            runInAction(() => {
                this.product = product;
                this.status = product ? "success" : "error";
            });
        } catch (error) {
            runInAction(() => this.status = "error");
        }
    }
}

export default new ProductStore();