import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories/categories.service";
import { CreateCategoryDto } from "../services/categories/dto/create-category.dto";
import productsService from "../services/products/products.service";
import shopService from "../services/shop/shop.service";
import { ICategory } from "../types/ICategory";
import { IContact } from "../types/IContact";
import { IBanner } from "../types/ILargeBanner";
import { IMail } from "../types/IMail";
import { IProduct } from "../types/IProduct";

class ShopStore {
    apiError: string;
    bestsellers: IProduct[];
    newProducts: IProduct[];

    banners: IBanner[];
    smallBanner: string;
    contacts: IContact[];

    isInit: boolean;

    constructor() {
        makeAutoObservable(this);

        this.bestsellers = [];
        this.newProducts = [];
        this.contacts = [];
        this.isInit = false;
        this.fetchAllInfo();
    }



    async fetchAllInfo() {
        const shopInfoPromise = shopService.getShopInfo();
        const bestsellersPromise = productsService.getBestsellers();
        const newProductsPromise = productsService.getNewProducts();

        const [shopInfo, bestsellers, newProducts] = [await shopInfoPromise, await bestsellersPromise, await newProductsPromise];

        this.banners = shopInfo.banners;
        this.smallBanner = shopInfo.smallBanner;
        this.contacts = shopInfo.contacts;
        this.bestsellers = bestsellers;
        this.newProducts = newProducts;

        this.isInit = true;
    }

    getBestsellersByCategory(categoryId: number) {
        return this.bestsellers.filter(b => b.categoryId === categoryId);
    }

    async sendMail(mail: IMail) {
        try {
            await shopService.sendMail(mail);
            return true;
        } catch (e) {
            this.apiError = shopService.getError();
            return false;
        }
    }



    async addBanner(banner: IBanner, img: File) {
        const newBanner = await shopService.addBanner(banner, img);
        this.banners.push(newBanner);
    }

    async editBanner(banner: IBanner, img?: File) {
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