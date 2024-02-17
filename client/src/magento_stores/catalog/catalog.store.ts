import { makeAutoObservable, runInAction } from "mobx";
import categoriesService from "../../magento_services/categories/categories.service";
import prodcutsService from "../../magento_services/products/prodcuts.service";
import { ICategoryList } from "../../types/magento/ICategoryList";
import { IProduct } from "../../types/magento/IProduct";

class CatalogStore {

    public categoryList: ICategoryList;
    public products: IProduct[];
    public status: 'initial' | 'loading' | 'success' | 'error';

    constructor() {
        makeAutoObservable(this);
    }

    async init() {
        runInAction(() => this.status = 'loading');

        try {
            const categoryList = await categoriesService.getCategoryList();

            runInAction(() => {
                this.categoryList = categoryList;
                this.status = 'success';
            });
        } catch (error) {
            runInAction(() => this.status = 'error');
        }
    }

    async loadProductsByCategory(categoryId: number) {
        runInAction(() => this.status = 'loading');

        try {
            const products = await prodcutsService.getProductsByCategoryId(categoryId);

            runInAction(() => {
                this.products = products;
                this.status = 'success';
            });
        } catch (error) {
            runInAction(() => this.status = 'error');
        }
    }
}

export default new CatalogStore();