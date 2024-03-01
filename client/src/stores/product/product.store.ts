import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../services/products/prodcuts.service";
import { IProduct } from "../../types/magento/IProduct";

class ProductStore {
    public status: "initial" | "loading" | "success" | "error";
    public product: IProduct | null;
    public relatedProducts: IProduct[];

    constructor() {
        makeAutoObservable(this);
        this.status = "initial";
        this.product = null;
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