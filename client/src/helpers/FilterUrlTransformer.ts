import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { SortType } from '../enums/SortType.enum';
import { FilterOptions } from '../services/products/products.service';


const FILTER_ITEM_REGEX = /(\d+-\d+)/g;

class FilterUrlTransformer {

    parseEnumSort(urlValue: string): SortType | null {
        const key = Object.entries(SortType).find(([key, value]) => value === urlValue);
        if (!key) {
            return null;
        }

        return SortType[key[0] as keyof typeof SortType];
    }

    parseNumber(urlValue: string): number | null {
        if (urlValue && !isNaN(Number(urlValue))) {
            return Number(urlValue);
        }

        return null;
    }

    parseFilters(urlFilters: string): Map<number, number[]> {
        const filters = new Map<number, number[]>();
        const filterParts = [...urlFilters.matchAll(FILTER_ITEM_REGEX)].map(part => part[0])

        filterParts.forEach(part => {
            const attrId = Number(part.toString().split('-')[0]);
            const valueId = Number(part.toString().split('-')[1]);

            if (!filters.has(attrId)) {
                filters.set(attrId, []);
            }

            filters.get(attrId)?.push(valueId);
        })


        return filters;
    }

    transformAttrMapToUrl(attributes: Map<number, number[]>): string {
        const attrPairs: string[] = [];
        for (const [attrId, valueIds] of attributes) {
            valueIds.forEach(vId => {
                attrPairs.push(`${attrId}-${vId}`);
            })
        }

        return attrPairs.join(',');
    }

    transformArrayToUrl(values: Array<any>) {
        return values.join(',');
    }

    buildFilterUrl(filter: FilterOptions) {
        let urlParams = new URLSearchParams();

        if (filter.sort != null && filter.sort !== SortType.NOT_SELECTED) {
            urlParams.append('sort', filter.sort.toString())
        }

        if (filter.page) {
            urlParams.append('page', filter.page.toString());
        }

        if (filter.search) {
            urlParams.append('search', filter.search);
        }

        if (filter.minPrice && filter.minPrice > 0) {
            urlParams.append('minPrice', filter.minPrice?.toString());
        }

        if (filter.maxPrice) {
            urlParams.append('maxPrice', filter.maxPrice?.toString());
        }

        if (filter.brands && filter.brands.length !== 0) {
            urlParams.append('brands', this.transformArrayToUrl(filter.brands));
        }

        if (filter.filter && filter.filter.size !== 0) {
            urlParams.append('filter', this.transformAttrMapToUrl(filter.filter));
        }

        return decodeURIComponent(urlParams.toString());
    }
}

export default new FilterUrlTransformer()