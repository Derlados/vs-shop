import { axiosInstance, headersAuth, headersAuthJson } from "..";
import filterUrlTransformer from "../../helpers/FilterUrlTransformer";
import { ICategory } from "../../types/ICategory";
import { IFilterAttribute, IFullFilter } from "../../types/IFilterAttribute";
import { FilterOptions } from "../products/products.service";
import { Service } from "../service";

class CategoryService extends Service {

    async getAll(): Promise<ICategory[]> {
        const { data } = await axiosInstance.get<ICategory[]>(this.apiUrl, { headers: headersAuthJson() });
        return data;
    }

    async getCategoryByRouteName(categoryName: string): Promise<ICategory> {
        const { data } = await axiosInstance.get<ICategory>(`${this.apiUrl}/category=${categoryName}`, { headers: headersAuthJson() });
        return data;
    }

    async getFilters(categoryId: number, filters?: FilterOptions): Promise<IFullFilter> {
        const { data } = await axiosInstance.get<IFullFilter>(`${this.apiUrl}/${categoryId}/filters`, {
            headers: headersAuthJson(),
            params: {
                ...filters,
                brands: filters?.brands && filters?.brands?.length != 0 ? filterUrlTransformer.transformArrayToUrl(filters.brands) : null,
                filter: filters?.filter ? filterUrlTransformer.transformAttrMapToUrl(filters?.filter) : null
            },
        });
        return data;
    }
}

export default new CategoryService('/categories');