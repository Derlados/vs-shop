import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories/categories.service";
import { CreateCategoryDto } from "../services/categories/dto/create-category.dto";
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

    async addCategory(data: CreateCategoryDto, img: File) {
        const newCategory = await categoriesService.createCategory(data);
        newCategory.img = await categoriesService.editCategoryImage(newCategory.id, img);
        this.categories.push(newCategory);
    }

    async editCategory(id: number, data: CreateCategoryDto, img?: File) {
        const updatedCategory = await categoriesService.editCategory(id, data);
        if (img) {
            updatedCategory.img = await categoriesService.editCategoryImage(updatedCategory.id, img);
        }
        this.categories[this.categories.findIndex(c => c.id === id)] = updatedCategory;
    }

    async deleteCategory(id: number) {
        await categoriesService.deleteCategory(id);
        this.categories.splice(this.categories.findIndex(c => c.id === id), 1);
    }

    getCategoryById(id: number) {
        return this.categories.find((c) => c.id === id)
    }

    getCategoryByRoute(routeName: string) {
        return this.categories.find((c) => c.routeName === routeName)
    }
}

export default new ShopStore();