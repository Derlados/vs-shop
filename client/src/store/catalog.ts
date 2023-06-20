import { makeAutoObservable } from "mobx";
import catalogsService from "../services/catalogs/catalogs.service";
import categoriesService from "../services/categories/categories.service";
import { CreateCategoryDto } from "../services/categories/dto/create-category.dto";
import { ICatalog } from "../types/ICatalog";
import { ICategory } from "../types/ICategory";

class CatalogStore {
    catalogs: ICatalog[];
    isInit: boolean;

    constructor() {
        makeAutoObservable(this, {}, { deep: true });

        this.catalogs = [];
        this.isInit = false;

        this.fetchAll();
    }

    get categories(): ICategory[] {
        const categories: ICategory[] = [];
        for (const catalog of this.catalogs) {
            categories.push(...catalog.categories);
        }
        return categories;
    }

    get categoryRoutes(): string[] {
        return this.categories.map(c => c.routeName);
    }

    async fetchAll() {
        this.catalogs = await catalogsService.getAll();
        this.isInit = true;
    }

    async fetchFilters(routeName: string) {
        const category = this.categories.find(c => c.routeName === routeName)
        if (category) {
            await categoriesService.getFilters(category.id);
        }
    }

    isValidRouteCategory(routeName: string): boolean {
        return this.categories.find(c => c.routeName === routeName) !== undefined;
    }

    ///////////////////////// РАБОТА С КАТЕГОРИЯМИ ///////////////////////////////////

    getCategoryById(id: number) {
        return this.categories.find((c) => c.id === id)
    }

    getCategoryByRoute(routeName: string) {
        return this.categories.find((c) => c.routeName === routeName)
    }

    async addCategory(data: CreateCategoryDto, img: File) {
        const newCategory = await categoriesService.createCategory(data);
        newCategory.img = await categoriesService.editCategoryImage(newCategory.id, img);

        const catalog = this.catalogs.find(c => c.id === data.catalogId);
        if (catalog) {
            catalog.categories.push(newCategory);
        }
    }

    async editCategory(id: number, data: CreateCategoryDto, img?: File) {
        const updatedCategory = await categoriesService.editCategory(id, data);
        if (img) {
            updatedCategory.img = await categoriesService.editCategoryImage(updatedCategory.id, img);
        }

        const catalog = this.catalogs.find(c => c.id !== data.catalogId);
        if (catalog) {
            catalog.categories[this.categories.findIndex(c => c.id === id)] = updatedCategory;
        }
    }

    async deleteCategory(id: number, catalogId: number) {
        await categoriesService.deleteCategory(id);

        const catalog = this.catalogs.find(c => c.id === catalogId);
        if (catalog) {
            catalog.categories.splice(catalog.categories.findIndex(c => c.id === id), 1);
        }

    }

    ///////////////////////// РАБОТА С КАТАЛОГАМИ ////////////////////////////////////////

    async addCatalog(name: string) {
        const newCatalog = await catalogsService.createCatalog(name);
        this.catalogs.push(newCatalog);
    }

    async editCatalog(id: number, name: string) {
        const catalogIndex = this.catalogs.findIndex(c => c.id)
        if (catalogIndex !== -1) {
            const updatedCatalog = await catalogsService.editCatalog(id, name);
            this.catalogs[catalogIndex] = { ...updatedCatalog, ...this.catalogs[catalogIndex] };
        }
    }

    async deleteCatalog(id: number) {
        await catalogsService.deleteCatalog(id);
        this.catalogs.splice(this.catalogs.findIndex(c => c.id === id), 1);
    }
}

export default new CatalogStore();