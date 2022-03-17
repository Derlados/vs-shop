import { makeAutoObservable } from "mobx";
import { IFilters, IProduct, IRange } from "../types/types";

export enum SortType {
    NOT_SELECTED,
    PRICE_ASC,
    PRICE_DESC,
    NEW,
    DISCOUNT
}

class ShopStore {
    private static MAX_PRODUCTS_BY_PAGE = 16;
    public products: IProduct[];
    public filters: IFilters;
    public currentPage: number;
    public selectedSort: SortType;

    constructor() {
        makeAutoObservable(this);
        this.products = this.testGenProducts();
        this.filters = {
            priceRange: {
                min: 0,
                max: 1000
            },
            attributes: [
                {
                    name: "ATTRIBUTE 1",
                    values: [
                        {
                            value: "value 1",
                            checked: false
                        },
                        {
                            value: "value 2",
                            checked: false
                        },
                        {
                            value: "value 3",
                            checked: true
                        },
                        {
                            value: "value 4",
                            checked: false
                        },
                    ]
                },
                {
                    name: "ATTRIBUTE 2",
                    values: [
                        {
                            value: "value 1",
                            checked: true
                        },
                        {
                            value: "value 2",
                            checked: true
                        }
                    ]
                },
                {
                    name: "ATTRIBUTE 3",
                    values: [
                        {
                            value: "value 1",
                            checked: false
                        },
                        {
                            value: "value 2",
                            checked: false
                        },
                        {
                            value: "value 3",
                            checked: false
                        }
                    ]
                }
            ]
        }
        this.currentPage = 1;
        this.selectedSort = SortType.NOT_SELECTED;
    }

    get filteredProducts(): IProduct[] {
        let products = [...this.products];

        return products;
    }

    get maxPages(): number {
        let maxPages: number = Math.floor(this.filteredProducts.length / ShopStore.MAX_PRODUCTS_BY_PAGE);
        if (this.filteredProducts.length % ShopStore.MAX_PRODUCTS_BY_PAGE != 0) {
            ++maxPages;
        }
        return maxPages;
    }

    private getPriceRange(): IRange {
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

    private getFilterAttributes() {

    }

    private testGenProducts(): IProduct[] {
        const products: IProduct[] = [];
        for (let i = 0; i < 48; ++i) {
            products.push({
                id: i,
                isNew: i < 9,
                title: "Originals Kaval Windbr",
                img: 'https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg',
                price: 18.99,
                oldPrice: 19.99,
                discountPercent: 5
            })
        }

        return products;
    }

    public setSortType(sortType: SortType) {
        this.selectedSort = sortType;
    }

    public backPage() {
        if (this.currentPage != 1) {
            --this.currentPage;
        }
    }

    public nextPage() {
        if (this.currentPage != this.maxPages) {
            ++this.currentPage;
        }
    }

    public setPage(page: number) {
        this.currentPage = page;
    }
}

export default new ShopStore();