import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../magento_services/products/prodcuts.service";
import { IProduct } from "../../types/magento/IProduct";

class ProductStore {

    public status: "initial" | "loading" | "success" | "error";
    public product: IProduct;
    public relatedProducts: IProduct[];

    constructor() {
        makeAutoObservable(this);
    }

    async loadProduct(sku: string) {
        runInAction(() => this.status = "loading");

        try {
            const product = await prodcutsService.getProductBySku(sku);

            runInAction(() => {
                this.product = product;
                this.status = "success";
            });
        } catch (error) {
            runInAction(() => this.status = "error");
        }
    }
}

export default new ProductStore();