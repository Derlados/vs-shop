import cyrillicToTranslit from "cyrillic-to-translit-js";
import { makeAutoObservable } from "mobx";
import categoriesService from "../services/categories/categories.service";
import productsService, { FilterOptions } from "../services/products/products.service";
import { ICategory } from "../types/ICategory";
import { IFilters, IRange } from "../types/IFilters";
import { IProduct } from "../types/IProduct";
import { IValue } from "../types/IValue";


//TODO Когда будет много товаров, логику фильтрации вынести на сервер
class ProductStore {
    public category: ICategory;
    public products: IProduct[];
    public filters: IFilters;

    public brands: string[];

    public isLoading: boolean;


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
        this.isLoading = false;
        this.products = [];
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

    async fetchProducts(categoryRoute: string, filters?: FilterOptions) {
        this.isLoading = true;

        this.category = await categoriesService.getCategoryByRouteName(categoryRoute);
        if (!this.category) {
            this.isLoading = false;
            return;
        }

        if (filters) {
            const { search: text, minPrice, maxPrice, filter: attributes, brands } = filters;

            this.products = await productsService.getProductsByCategory(this.category.id, {
                search: text ?? undefined,
                brands: brands?.length !== 0 ? brands : undefined,
                minPrice: minPrice !== 0 ? minPrice : undefined,
                maxPrice: maxPrice !== 0 ? maxPrice : undefined,
                filter: attributes?.size !== 0 ? attributes : undefined
            });
        } else {
            this.products = await productsService.getProductsByCategory(this.category.id);
        }

        this.brands = this.category.allBrands ?? [];

        const fullFilters = await categoriesService.getFilters(this.category.id, filters);
        this.filters = {
            priceRange: { min: fullFilters.minPrice, max: fullFilters.maxPrice },
            attributes: fullFilters.attributes,
            maxPages: fullFilters.pages
        }

        this.isLoading = false;
    }

    async fetchProductById(id: number): Promise<IProduct> {
        let product = this.getProductById(id);
        if (!product) {
            product = await productsService.getProductById(id);

        }

        return product;
    }

    async fetchRelatedProducts(product: IProduct, maxProducts: number): Promise<IProduct[]> {
        const products = await productsService.getProductsByCategory(product.categoryId, { brands: [product.brand] });
        const shuffledProducts = [...products].sort(() => 0.5 - Math.random());

        return shuffledProducts.slice(0, maxProducts);
    }

    public getProductById(id: number): IProduct | undefined {
        return this.products.find(p => p.id === id);
    }

    public async loadProductCount(product: IProduct) {
        product.count = await productsService.getProductCount(product.id);
    }

    //TODO если будет медленно работать, то количество можно не считать. Использовать findIndex
    public isProductExistByValue(attributeId: number, value: string) {
        return this.products.findIndex(p => (p.attributes.find(a => a.id === attributeId)?.value.name ?? '') == value) !== -1;
    }

    //TODO если будет медленно работать, то количество можно не считать. Использовать findIndex
    public getCountProductExistByBrand(brand: string) {
        return this.products.filter(p => (p.brand == brand)).length;
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