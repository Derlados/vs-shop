import cyrillicToTranslit from "cyrillic-to-translit-js";
import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories/categories.service";
import productsService from "../services/products/products.service";
import { ICategory } from "../types/ICategory";
import { IFilters, IRange } from "../types/IFilters";
import { IProduct } from "../types/IProduct";
import { IValue } from "../types/IValue";

export enum SortType {
    NOT_SELECTED,
    PRICE_ASC,
    PRICE_DESC,
    NEW,
    DISCOUNT
}

//TODO Когда будет много товаров, логику фильтрации вынести на сервер
class ProductStore {
    public category: ICategory;
    public filters: IFilters;
    public products: IProduct[];

    public brands: string[];
    public selectedSort: SortType;
    public selectedPriceRange: IRange;
    public selectedTranslitBrands: string[]; // Все бренд переведены в английский транслит
    public searchString: string;
    public selectedFilters: Map<number, IValue[]>;

    constructor() {
        makeAutoObservable(this);
        this.category = {
            id: -1,
            catalogId: -1,
            name: '',
            img: '',
            isNew: false,
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
        this.selectedTranslitBrands = [];
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

    async fetchByCategory(categoryRoute: string) {
        if (this.category.routeName === categoryRoute) {
            return;
        }

        this.clearAll();

        this.category = await categoriesService.getCategoryByRouteName(categoryRoute);
        if (!this.category) {
            return;
        }
        this.products = await productsService.getProductsByCategory(this.category.id);
        this.brands = this.category.allBrands ?? [];

        this.selectedPriceRange = this.priceRange;

        const filterAttrs = await categoriesService.getFilters(this.category.id);
        this.filters = {
            priceRange: this.priceRange,
            attributes: filterAttrs
        }

        for (const attribute of this.filters.attributes) {
            this.selectedFilters.set(attribute.attribute.id, []);
        }
    }

    async fetchProductsByText(searchText: string) {
        this.clearAll();
        this.products = await productsService.getProductByText(searchText);
        this.selectedPriceRange = this.priceRange;
    }

    async fetchProductById(id: number): Promise<IProduct> {
        let product = this.getProductById(id);
        if (!product) {
            product = await productsService.getProductById(id);

        }

        return product;
    }

    async fetchRelatedProducts(product: IProduct, maxProducts: number): Promise<IProduct[]> {
        const products = await productsService.getFilterProducts({ brands: [product.brand] });
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());

        return shuffledProducts.slice(0, maxProducts);
    }

    public getProductById(id: number): IProduct | undefined {
        return this.products.find(p => p.id === id);
    }

    public async loadProductCount(product: IProduct) {
        product.count = await productsService.getProductCount(product.id);
    }

    public clearFilters() {
        this.selectedTranslitBrands = [];
        this.selectedPriceRange = this.priceRange;
        for (const attribute of this.filters.attributes) {
            this.selectedFilters.set(attribute.attribute.id, []);
        }
    }

    private clearAll() {
        this.products = [];
        this.searchString = '';
        this.selectedFilters.clear();
        this.selectedTranslitBrands = [];
        this.selectedPriceRange = this.priceRange;
        this.filters = {
            priceRange: { min: 0, max: 0 },
            attributes: []
        };
    }

    /////////////////////////////////// ФИЛЬТРАЦИЯ И СОРТИРОВКА ПРОДУКТОВ ///////////////////////////////////

    private filterProducts(products: IProduct[]) {
        let filteredProducts = [];

        // По цене 
        filteredProducts = products.filter(p => p.price >= this.selectedPriceRange.min && p.price <= this.selectedPriceRange.max);

        // По бренду
        if (this.selectedTranslitBrands.length !== 0) {
            filteredProducts = filteredProducts.filter(p => this.selectedTranslitBrands.includes(cyrillicToTranslit().transform(p.brand, "_")));
        }

        // По ключевому слову
        const searchString = this.searchString.replace(/\s+/, ' ').toLowerCase();
        if (this.searchString) {
            filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(searchString))
        }

        // По фильтрам
        for (const [attributeId, values] of this.selectedFilters) {
            if (values.length !== 0) {
                const valueNames = values.map(v => v.name);
                filteredProducts = filteredProducts.filter(p => valueNames.includes(p.attributes.find(a => a.id === attributeId)?.value.name ?? ''));
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
        this.searchString = searchString;
    }

    public selectPriceRange(min: number, max: number) {
        this.selectedPriceRange = { min: min, max: max };
    }

    public selectBrands(translitBrands: string[]) {
        this.selectedTranslitBrands.push(...translitBrands);
    }

    public hasSelectedBrand(brand: string) {
        return this.selectedTranslitBrands.findIndex(b => b === brand) !== -1;
    }

    public setFilter(attributeId: number, ...valueids: number[]) {
        const allValues = this.filters.attributes.find(a => a.attribute.id === attributeId)?.attribute.allValues;
        if (allValues) {
            const values: IValue[] = allValues.filter(v => valueids.includes(v.id));
            this.selectedFilters.set(attributeId, values);
        }
    }

    public hasSelectedFilter(attributeId: number, valueId: number) {
        const values = this.selectedFilters.get(attributeId);
        if (values && values.find(v => v.id === valueId)) {
            return true;
        }

        return false;
    }

    //TODO если будет медленно работать, то количество можно не считать. Использовать findIndex
    public countProductByValue(attributeId: number, value: string) {
        return this.filteredProducts.filter(p => (p.attributes.find(a => a.id === attributeId)?.value.name ?? '') === value).length;
    }

    //TODO если будет медленно работать, то количество можно не считать. Использовать findIndex
    public conntProductByBrand(brand: string) {
        return this.filteredProducts.filter(p => (p.brand == brand)).length;
    }

    public setSortType(sortType: SortType) {
        this.selectedSort = sortType;
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

    public async setBestsellerStatus(id: number, isBestseller: boolean) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            return;
        }

        if (isBestseller) {
            productsService.setBestsellerStatus(id)
        } else {
            productsService.deleteBestsellerStatus(id)
        }

        product.isBestseller = isBestseller;
    }

    public async deleteProduct(id: number) {
        await productsService.deleteProduct(id);
        this.products.splice(this.products.findIndex(p => p.id === id), 1);
    }
}

export default new ProductStore();