import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories.service";
import { ICategory } from "../types/ICategory";
import { IProduct } from "../types/IProduct";

class ShopStore {
    categories: ICategory[];
    bestSellers: IProduct[];
    newProducts: IProduct[];

    constructor() {
        makeAutoObservable(this);
        this.categories = [];
        this.bestSellers = [];
        this.newProducts = [];
        this.fetchAll();
    }

    async fetchAll() {
        this.categories = await categoriesService.getAllCategories();
    }

    getCategoryByRoute(routeName: string) {
        return this.categories.find((c) => c.routeName === routeName)
    }
}

export default new ShopStore();