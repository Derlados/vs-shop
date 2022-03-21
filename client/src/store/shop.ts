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
    public selectedPriceRange: IRange;
    public searchString: string;

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
        this.selectedPriceRange = this.priceRange;
        this.searchString = '';
    }

    get filteredProducts(): IProduct[] {
        let products = [...this.products];
        products = this.filterProducts(products);
        products = this.sortProducts(products);
        return products;
    }

    get maxPages(): number {
        let maxPages: number = Math.floor(this.filteredProducts.length / ShopStore.MAX_PRODUCTS_BY_PAGE);
        if (this.filteredProducts.length % ShopStore.MAX_PRODUCTS_BY_PAGE != 0) {
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

    private getFilterAttributes() {

    }

    private filterProducts(products: IProduct[]) {
        let filteredProducts = [];

        // По цене 
        filteredProducts = products.filter(p => p.price >= this.selectedPriceRange.min && p.price <= this.selectedPriceRange.max);

        // По ключевому слову
        if (this.searchString) {
            filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(this.searchString))
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

    private testGenProducts(): IProduct[] {
        const products: IProduct[] = [];
        for (let i = 0; i < 48; ++i) {
            products.push({
                id: i,
                isNew: i < 9,
                title: "Originals Kaval Windbr",
                imgs: ['https://template.hasthemes.com/melani/melani/assets/img/product/product-9.jpg',
                    'https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img2.jpg',
                    'https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img5.jpg',
                    'https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img3.jpg',
                    'https://template.hasthemes.com/melani/melani/assets/img/product/product-details-img3.jpg'
                ],
                price: 18.99,
                oldPrice: 19.99,
                discountPercent: 5,
                count: 300
            })
        }

        return products;
    }

    public setSearchString(searchString: string) {
        this.searchString = searchString.replace(/\s+/, ' ').toLowerCase();
    }

    public setPriceRange(min: number, max: number) {
        this.selectedPriceRange = { min: min, max: max };
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