import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories.service";
import productsService from "../services/products.service";
import { ICategory } from "../types/ICategory";
import { IFilters, IRange } from "../types/IFilters";
import { IProduct } from "../types/IProduct";
import shop from "./shop";

export enum SortType {
    NOT_SELECTED,
    PRICE_ASC,
    PRICE_DESC,
    NEW,
    DISCOUNT
}

class CatalogStore {
    private static MAX_PRODUCTS_BY_PAGE = 16;

    private category: ICategory;
    public filters: IFilters;
    public products: IProduct[];

    public selectedPage: number;
    public selectedSort: SortType;
    public selectedPriceRange: IRange;
    public searchString: string;
    public selectedFilters: Map<string, string[]>;

    constructor() {
        makeAutoObservable(this);
        this.category = {
            id: -1,
            name: '',
            img: '',
            routeName: '',
            products: 0
        };
        this.products = [];
        this.filters = {
            priceRange: { min: 0, max: 0 },
            attributes: []
        };

        this.selectedPage = 1;
        this.selectedSort = SortType.NOT_SELECTED;
        this.selectedPriceRange = this.priceRange;
        this.searchString = '';
        this.selectedFilters = new Map();
    }

    get filteredProducts(): IProduct[] {
        let products = [...this.products];
        products = this.filterProducts(products);
        products = this.sortProducts(products);
        return products;
    }

    get maxPages(): number {
        let maxPages: number = Math.floor(this.filteredProducts.length / CatalogStore.MAX_PRODUCTS_BY_PAGE);
        if (this.filteredProducts.length % CatalogStore.MAX_PRODUCTS_BY_PAGE != 0) {
            ++maxPages;
        }
        return maxPages;
    }

    get priceRange(): IRange {
        const range: IRange = {
            min: Number.MAX_VALUE,
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

    async init(categoryName: string) {
        this.category = await categoriesService.getCategoryByName(categoryName);
        this.products = await productsService.getPrdouctsBycategory(this.category.id);

        this.selectedPriceRange = this.priceRange;
        const filterAttrs = await categoriesService.getFilters(this.category.id);
        this.filters = {
            priceRange: this.priceRange,
            attributes: filterAttrs
        }

        for (const attribute of this.filters.attributes) {
            this.selectedFilters.set(attribute.attribute.name, []);
        }
    }

    public findProductById(id: number): IProduct | undefined {
        return this.products.find(p => p.id === id);
    }

    /////////////////////////////////// ФИЛЬТРАЦИЯ И СОРТИРОВКА ПРОДУКТОВ ///////////////////////////////////

    private filterProducts(products: IProduct[]) {
        let filteredProducts = [];

        // По цене 
        filteredProducts = products.filter(p => p.price >= this.selectedPriceRange.min && p.price <= this.selectedPriceRange.max);


        // По ключевому слову
        if (this.searchString) {
            filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(this.searchString))
        }

        // По фильтрам
        for (const [attribute, values] of this.selectedFilters) {
            if (values.length !== 0) {
                filteredProducts = filteredProducts.filter(p => values.includes(p.attributes.get(attribute) ?? ''))
            }

        }
        console.log(filteredProducts);

        return filteredProducts;
    }

    private sortProducts(products: IProduct[]): IProduct[] {
        switch (this.selectedSort) {
            case SortType.NOT_SELECTED: {
                return products;
            }
            case SortType.PRICE_ASC: {
                return products.sort((p1, p2) => {
                    return p1.price > p2.price ? 1 : -1;
                });
            }
            case SortType.PRICE_DESC: {
                return products.sort((p1, p2) => {
                    return p1.price < p2.price ? 1 : -1;
                })
            }
            case SortType.NEW: {
                return products.sort((p1, p2) => {
                    return (!p1.isNew && p2.isNew) ? 1 : -1;
                })
            }
            case SortType.DISCOUNT: {
                return products.sort((p1, p2) => {
                    return (p1.discountPercent == 0 && p2.discountPercent != 0) ? 1 : -1;
                })
            }
        }
    }

    public setSearchString(searchString: string) {
        this.searchString = searchString.replace(/\s+/, ' ').toLowerCase();
    }

    public selectPriceRange(min: number, max: number) {
        this.selectedPriceRange = { min: min, max: max };
    }

    public setSortType(sortType: SortType) {
        this.selectedSort = sortType;
    }

    public setFilter(attribute: string, value: string) {
        const values = this.selectedFilters.get(attribute);
        values?.push(value);
        console.log(this.selectedFilters);
    }

    public deleteFilter(attribute: string, value: string) {
        const values = this.selectedFilters.get(attribute);
        values?.slice(values?.findIndex(v => v === value), 1);
        console.log(this.selectedFilters);
    }

    /////////////////////////////////// ФИЛЬТРАЦИЯ И СОРТИРОВКА ПРОДУКТОВ ///////////////////////////////////

    public backPage() {
        if (this.selectedPage != 1) {
            --this.selectedPage;
        }
    }

    public nextPage() {
        if (this.selectedPage != this.maxPages) {
            ++this.selectedPage;
        }
    }

    public selectPage(page: number) {
        this.selectedPage = page;
    }
}

export default new CatalogStore();