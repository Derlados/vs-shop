import { makeAutoObservable, runInAction } from "mobx";
import categoriesService from "../../services/categories/categories.service";
import productsService, { FilterOptions } from "../../services/products/products.service";
import { ICategory } from "../../types/ICategory";
import { IFilters, IRange } from "../../types/IFilters";
import { IProduct } from "../../types/IProduct";

export enum SearchStoreStatus {
    initial, loading, success, wrongCategoryFailure, failure, updating
}

class SearchStore {
    public category: ICategory;
    public products: IProduct[];
    public popularProducts: IProduct[];
    public filters: IFilters;

    public brands: string[];
    public status: SearchStoreStatus;

    constructor() {
        makeAutoObservable(this);

        this.status = SearchStoreStatus.initial;
        this.products = [];
        this.popularProducts = [];
        this.brands = [];
    }

    async init(categoryRoute: string, initialFilters?: FilterOptions) {
        if (this.status === SearchStoreStatus.loading) return;

        runInAction(() => this.status = SearchStoreStatus.loading);

        try {
            const foundCategory = await categoriesService.getCategoryByRouteName(categoryRoute);
            if (!foundCategory) {
                this.status = SearchStoreStatus.wrongCategoryFailure;
                return;
            }


            const [products, filters, popularProducts] = await Promise.all([
                this.fetchProducts(foundCategory, initialFilters),
                this.fetchFilters(foundCategory, initialFilters),
                this.fetchBestSellers(foundCategory)
            ]);

            runInAction(() => {
                this.category = foundCategory;
                this.brands = this.category.allBrands ?? [];
                this.products = products;
                this.filters = filters;
                this.popularProducts = popularProducts;

                this.status = SearchStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = SearchStoreStatus.failure);
        }
    }

    async initGlobalSearch(text: string) {
        if (this.status === SearchStoreStatus.loading) return;

        runInAction(() => this.status = SearchStoreStatus.loading);

        try {
            const products = await this.fetchProductsByText(text);

            runInAction(() => {
                this.products = products;
                this.status = SearchStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = SearchStoreStatus.failure);
        }
    }

    async updateCatalog(filterOptions?: FilterOptions) {
        if (this.status === SearchStoreStatus.updating) return;

        runInAction(() => this.status = SearchStoreStatus.updating);

        try {
            const [products, filters] = await Promise.all([
                this.fetchProducts(this.category, filterOptions),
                this.fetchFilters(this.category, filterOptions)
            ]);


            runInAction(() => {
                this.products = products;
                this.filters = filters;
                this.status = SearchStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = SearchStoreStatus.failure);
        }
    }

    async fetchProducts(category: ICategory, filters?: FilterOptions) {
        if (filters) {
            const { search: text, minPrice, maxPrice, filter: attributes, brands, page } = filters;

            return productsService.getProductsByCategory(category.id, {
                ...filters,
                page: page ?? undefined,
                search: text ?? undefined,
                brands: brands?.length !== 0 ? brands : undefined,
                minPrice: minPrice !== 0 ? minPrice : undefined,
                maxPrice: maxPrice !== 0 ? maxPrice : undefined,
                filter: attributes?.size !== 0 ? attributes : undefined
            });
        } else {
            return productsService.getProductsByCategory(category.id);
        }
    }

    async fetchProductsByText(text: string) {
        return productsService.getProductsByText(text);
    }

    async fetchFilters(category: ICategory, filterOptions?: FilterOptions): Promise<IFilters> {
        const fullFilters = await categoriesService.getFilters(category.id, filterOptions);
        const filters: IFilters = {
            priceRange: { min: fullFilters.minPrice, max: fullFilters.maxPrice },
            attributes: fullFilters.attributes,
            maxPages: fullFilters.pages
        }

        return filters;
    }

    async fetchBestSellers(category: ICategory) {
        const bestsellers = await productsService.getBestsellers();
        return bestsellers.filter(bestseller => bestseller.categoryId == category.id);
    }

    //TODO если будет медленно работать, то количество можно не считать. Использовать findIndex
    public isProductExistByValue(attributeId: number, value: string) {
        return this.products.findIndex(p => (p.attributes.find(a => a.id === attributeId)?.value.name ?? '') == value) !== -1;
    }

    //TODO если будет медленно работать, то количество можно не считать. Использовать findIndex
    public getCountProductExistByBrand(brand: string) {
        return this.products.filter(p => (p.brand == brand)).length;
    }

    get priceRange(): IRange {
        const range: IRange = {
            min: 0,
            max: 0
        }

        for (const product of this.products) {
            if (product.price > range.max) {
                range.max = product.price;
            }

            if (product.price < range.min) {
                range.min = product.price;
            }
        }

        return range;
    }
}

export default new SearchStore();