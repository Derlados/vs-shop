import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories/categories.service";
import productsService from "../services/products/products.service";
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
    public category: ICategory;
    public filters: IFilters;
    public products: IProduct[];

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
            keyAttributes: [],
            productsCount: 0
        };
        this.products = [];
        this.filters = {
            priceRange: { min: 0, max: 0 },
            attributes: []
        };

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

    public isLoaded(categoryName: string) {
        return this.category.routeName === categoryName;
    }

    async init(categoryRoute: string) {
        this.category = await categoriesService.getCategoryByRouteName(categoryRoute);
        this.products = await productsService.getProductsByCategory(this.category.id);

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
    }

    public deleteFilter(attribute: string, value: string) {
        const values = this.selectedFilters.get(attribute);
        values?.splice(values?.findIndex(v => v === value), 1);
    }

    /////////////////////////////////// CRUD ОПЕРАЦИИ ДЛЯ ПРОДУКТОВ В КАТАЛОГЕ //////////////////////////////////

    public async addProduct(product: IProduct, images: File[], deletedImagesId?: number[], newMainImageId?: number) {
        product.categoryId = this.category.id;
        const newProduct = await productsService.addProducts(product);
        newProduct.images = await productsService.editProductImages(newProduct.id, images, deletedImagesId, newMainImageId);
        this.products.push(newProduct);
    }

    public async editProduct(id: number, product: IProduct, images: File[], deletedImagesId?: number[], newMainImageId?: number) {
        product.categoryId = this.category.id;
        const updatedProduct = await productsService.editProduct(id, product);
        updatedProduct.images = await productsService.editProductImages(updatedProduct.id, images, deletedImagesId, newMainImageId);
        this.products[this.products.findIndex(p => p.id === id)] = updatedProduct;
    }

    public async deleteProduct(id: number) {
        await productsService.deleteProduct(id);
        this.products.splice(this.products.findIndex(p => p.id === id), 1);
    }
}

export default new CatalogStore();