import { makeAutoObservable, runInAction } from "mobx";
import catalogsService from "../../services/catalogs/catalogs.service";
import categoriesService from "../../services/categories/categories.service";
import { CreateCategoryDto } from "../../services/categories/dto/create-category.dto";
import { ICatalog } from "../../types/ICatalog";
import { ICategory } from "../../types/ICategory";

export enum CatalogEditorStoreStatus {
    initial, loading, success, failure, updatingCategory, updatingCatalog, updatingCategoryFailure, updatingCatalogFailure
}

class CatlogEditorStore {
    status: CatalogEditorStoreStatus;
    catalogs: ICatalog[];

    get categories(): ICategory[] {
        const categories: ICategory[] = [];
        for (const catalog of this.catalogs) {
            categories.push(...catalog.categories);
        }
        return categories;
    }

    constructor() {
        makeAutoObservable(this);
        this.status = CatalogEditorStoreStatus.initial;
        this.catalogs = [];
    }

    async init() {
        runInAction(() => this.status = CatalogEditorStoreStatus.loading);

        try {
            const catalogs = await catalogsService.getAll();

            runInAction(() => {
                this.catalogs = catalogs;
                this.status = CatalogEditorStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CatalogEditorStoreStatus.failure);
        }
    }

    async addCatalog(name: string) {
        runInAction(() => this.status = CatalogEditorStoreStatus.updatingCatalog);

        try {
            const newCatalog = await catalogsService.createCatalog(name);

            runInAction(() => {
                this.catalogs = [...this.catalogs, newCatalog];
                this.status = CatalogEditorStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CatalogEditorStoreStatus.failure);
        }
    }

    async editCatalog(id: number, name: string) {
        runInAction(() => this.status = CatalogEditorStoreStatus.updatingCatalog);

        try {
            const catalogIndex = this.catalogs.findIndex(c => c.id)
            if (catalogIndex !== -1) {
                const updatedCatalog = await catalogsService.editCatalog(id, name);
                this.catalogs = this.catalogs.map(c => c.id === id ? { ...c, ...updatedCatalog } : c);
            }

            runInAction(() => {
                this.catalogs = [...this.catalogs];
                this.status = CatalogEditorStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CatalogEditorStoreStatus.updatingCatalogFailure);
        }

    }

    async deleteCatalog(id: number) {
        runInAction(() => this.status = CatalogEditorStoreStatus.updatingCatalog);

        try {
            await catalogsService.deleteCatalog(id);

            runInAction(() => {
                this.catalogs = this.catalogs.filter(c => c.id !== id);
                this.status = CatalogEditorStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CatalogEditorStoreStatus.updatingCatalogFailure);
        }
    }

    async addCategory(data: CreateCategoryDto, img: File) {
        runInAction(() => this.status = CatalogEditorStoreStatus.updatingCategory);

        try {
            const newCategory = await categoriesService.createCategory(data);
            newCategory.img = await categoriesService.editCategoryImage(newCategory.id, img);

            const catalog = this.catalogs.find(c => c.id === data.catalogId);
            if (catalog) {
                catalog.categories.push(newCategory);
            }

            runInAction(() => {
                this.catalogs = [...this.catalogs];
                this.status = CatalogEditorStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CatalogEditorStoreStatus.updatingCategoryFailure);
        }
    }

    async editCategory(id: number, data: CreateCategoryDto, img?: File) {
        runInAction(() => this.status = CatalogEditorStoreStatus.updatingCategory);

        try {
            const updatedCategory = await categoriesService.editCategory(id, data);
            if (img) {
                updatedCategory.img = await categoriesService.editCategoryImage(updatedCategory.id, img);
            }


            const catalog = this.catalogs.find(c => c.id === data.catalogId);
            if (catalog) {
                catalog.categories = catalog.categories.map(c => c.id === id ? { ...c, ...updatedCategory } : c);
            }

            runInAction(() => {
                this.catalogs = [...this.catalogs];
                this.status = CatalogEditorStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CatalogEditorStoreStatus.updatingCategoryFailure);
        }
    }

    async deleteCategory(id: number, catalogId: number) {
        runInAction(() => this.status = CatalogEditorStoreStatus.updatingCategory);

        try {
            await categoriesService.deleteCategory(id);

            const catalog = this.catalogs.find(c => c.id === catalogId);
            if (catalog) {
                catalog.categories.splice(catalog.categories.findIndex(c => c.id === id), 1);
            }

            runInAction(() => {
                this.catalogs = [...this.catalogs];
                this.status = CatalogEditorStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CatalogEditorStoreStatus.updatingCategoryFailure);
        }
    }

    getCategoryById(id: number) {
        return this.categories.find((c) => c.id === id)
    }

    getCategoryByRoute(routeName: string) {
        return this.categories.find((c) => c.routeName === routeName)
    }
}

export default new CatlogEditorStore();