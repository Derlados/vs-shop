import { makeAutoObservable, runInAction } from "mobx";
import categoriesService from "../../services/categories/categories.service";
import prodcutsService from "../../services/products/prodcuts.service";
import { ICategoryList } from "../../types/magento/ICategoryList";
import { IManufacturer } from "../../types/magento/IManufacturer";
import { IProduct } from "../../types/magento/IProduct";

class CatalogStore {
    public manufacturers: IManufacturer[];
    public categoryList: ICategoryList | null;
    public status: 'initial' | 'loading' | 'success' | 'error';

    constructor() {
        makeAutoObservable(this);

        this.manufacturers = [];
        this.categoryList = null;
        this.status = 'initial';
    }

    async init() {
        runInAction(() => this.status = 'loading');

        try {
            const [categoryList, manufacturers] = await Promise.all([
                categoriesService.getCategoryList(),
                prodcutsService.getManufacturers()
            ]);

            runInAction(() => {
                this.manufacturers = manufacturers;
                this.categoryList = categoryList;
                this.status = 'success';
            });
        } catch (error) {
            runInAction(() => this.status = 'error');
        }
    }
}

export default new CatalogStore();