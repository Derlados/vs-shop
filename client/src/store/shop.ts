import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories/categories.service";
import { CreateCategoryDto } from "../services/categories/dto/create-category.dto";
import shopService from "../services/shop/shop.service";
import { ICategory } from "../types/ICategory";
import { IContact } from "../types/IContact";
import { IBanner } from "../types/ILargeBanner";
import { IProduct } from "../types/IProduct";

class ShopStore {
    categories: ICategory[];
    bestSellers: IProduct[];
    newProducts: IProduct[];

    banners: IBanner[];
    smallBanner: string;
    contacts: IContact[];

    constructor() {
        makeAutoObservable(this);

        this.categories = [];
        this.bestSellers = [];
        this.newProducts = [];
        this.fetchAllInfo();
    }

    get categoryRoutes(): string[] {
        return this.categories.map(c => c.routeName);
    }

    async fetchAllInfo() {
        const categoriesPromise = categoriesService.getAllCategories();
        const shopInfoPromise = shopService.getShopInfo();

        const [categories, shopInfo] = [await categoriesPromise, await shopInfoPromise];
        this.categories = categories;

        this.banners = shopInfo.banners;
        this.smallBanner = shopInfo.smallBanner;
        this.contacts = shopInfo.contacts;
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

    async addBanner(banner: IBanner, img: File) {
        const newBanner = await shopService.addBanner(banner, img);
        this.banners.push(newBanner);
    }

    async editBanner(banner: IBanner, img: File) {
        const updatedBanner = await shopService.editBanner(banner, img);
        const updatedIndex = this.banners.findIndex(b => b.id == updatedBanner.id);
        this.banners[updatedIndex] = updatedBanner;
    }

    async deleteBanner(id: number) {
        const deletedBannerIndex = this.banners.findIndex(b => b.id == id);
        if (deletedBannerIndex !== - 1) {
            await shopService.deleteBanner(id);
            this.banners.splice(deletedBannerIndex, 1)
        }
    }

    async editSmallBanner(img: File) {
        const smallBanner = await shopService.editSmallBanner(img);
        this.smallBanner = smallBanner;
    }

    async editContacts(contacts: IContact[]) {
        const updatedContacts = await shopService.editContacts(contacts);
        this.contacts = updatedContacts;
    }
}

export default new ShopStore();