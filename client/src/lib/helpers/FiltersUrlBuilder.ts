import { IRange } from "../../types/IFilters";
import cyrillicToTranslit from 'cyrillic-to-translit-js';


///TEMPLATE = brands=intel,amd;price=2000-3000;12-156,468;13-486;15-12,11,48;/

const BRAND_REGEX = /brands=([A-z|\,|-]+)/;
const BRAND_PREFIX = 'brands=';
const PRICE_REGEX = /price=([0-9]+-[0-9]+)/;
const PRICE_PREFIX = 'price=';
const FILTER_ITEM_REGEX = /([0-9]+)-([0-9|,]+)/g;

export class FilterUrlBuilder {
    private filtersUrl: string;

    public brands: string[];
    public filters: Map<number, number[]>; // <id аттрибута, id-шники значений>
    public priceRange?: IRange;

    constructor() {
        this.filtersUrl = '';
        this.brands = [];
        this.filters = new Map();
    }

    parse(url: string): FilterUrlBuilder {
        const priceUrl = url.match(PRICE_REGEX);
        if (priceUrl) {
            const priceRange = priceUrl[0].replace(PRICE_PREFIX, '').split('-');
            this.priceRange = {
                min: Number(priceRange[0]),
                max: Number(priceRange[1])
            }
        }

        const brandsUrl = url.match(BRAND_REGEX);
        if (brandsUrl) {
            this.brands = brandsUrl[0].replace(BRAND_PREFIX, '').split(',');
        }

        url = url.replace(BRAND_REGEX, '');
        url = url.replace(PRICE_REGEX, '');

        const filtersurl = url.match(FILTER_ITEM_REGEX);
        if (filtersurl) {
            for (const filterUrl of filtersurl) {
                const parts = filterUrl.split('-');

                const attributeId = Number(parts[0]);
                const valueIds = parts[1].split(',').map(v => Number(v));

                this.filters.set(attributeId, valueIds);
            }
        }

        return this;
    }

    selectFilter(attributeId: number, ...values: number[]): FilterUrlBuilder {
        if (!this.filters.has(attributeId)) {
            this.filters.set(attributeId, [])
        }

        this.filters.get(attributeId)?.push(...values);
        return this;
    }

    deselectFilter(attributeId: number, value: number) {
        const values = this.filters.get(attributeId);
        if (!values) {
            return;
        }

        values.splice(values.findIndex(v => v === value), 1)
        if (values.length === 0) {
            this.filters.delete(attributeId);
        }

        return this;
    }

    setPriceRange(range: IRange) {
        this.priceRange = range;
        return this;
    }

    selectBrand(brand: string) {
        this.brands.push(cyrillicToTranslit().transform(brand, "_"))
        return this;
    }

    deselectBrand(brand: string) {
        this.brands = this.brands.filter(b => b !== brand);
        return this;
    }

    build(): string {
        this.filtersUrl = '';

        if (this.brands.length !== 0) {
            this.filtersUrl += `${BRAND_PREFIX}${this.brands.join(',')};`;
        }

        if (this.priceRange) {
            this.filtersUrl += `${PRICE_PREFIX}${this.priceRange.min}-${this.priceRange.max};`;
        }

        for (const [attributeId, valueIds] of this.filters) {
            this.filtersUrl += `${attributeId}-${valueIds.join(',')};`;
        }

        if (this.filtersUrl.length !== 0) {
            this.filtersUrl = this.filtersUrl.slice(0, -1);
        }

        return this.filtersUrl;
    }
}