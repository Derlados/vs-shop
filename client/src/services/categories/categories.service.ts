import { axiosInstance, headers, headersJSON } from "..";
import filterUrlTransformer from "../../helpers/FilterUrlTransformer";
import { ICategory } from "../../types/ICategory";
import { IFilterAttribute, IFullFilter } from "../../types/IFilterAttribute";
import { FilterOptions } from "../products/products.service";
import { Service } from "../service";
import { CreateCategoryDto } from "./dto/create-category.dto";

class CategoryService extends Service {

    async getAll(): Promise<ICategory[]> {
        const { data } = await axiosInstance.get<ICategory[]>(this.API_URL, { headers: headersJSON() });
        return data;
    }

    async getCategoryByRouteName(categoryName: string): Promise<ICategory> {
        const { data } = await axiosInstance.get<ICategory>(`${this.API_URL}/category=${categoryName}`, { headers: headersJSON() });
        return data;
    }

    async getFilters(categoryId: number, filters?: FilterOptions): Promise<IFullFilter> {
        const { data } = await axiosInstance.get<IFullFilter>(`${this.API_URL}/${categoryId}/filters`, {
            headers: headersJSON(),
            params: {
                ...filters,
                brands: filters?.brands && filters?.brands?.length != 0 ? filterUrlTransformer.transformArrayToUrl(filters.brands) : null,
                filter: filters?.filter ? filterUrlTransformer.transformAttrMapToUrl(filters?.filter) : null
            },
        });
        return data;
    }

    async createCategory(body: CreateCategoryDto): Promise<ICategory> {
        const { data } = await axiosInstance.post<ICategory>(`${this.API_URL}`, body, { headers: headersJSON() });
        return data;
    }

    async editCategory(id: number, body: CreateCategoryDto): Promise<ICategory> {
        const { data } = await axiosInstance.put<ICategory>(`${this.API_URL}/${id}`, body, { headers: headersJSON() });
        return data;
    }

    async editCategoryImage(id: number, image: File): Promise<string> {
        const formData = new FormData();
        formData.append('image', image);
        const { data } = await axiosInstance.put<string>(`${this.API_URL}/${id}/image`, formData, { headers: headers() });
        return data;
    }

    async deleteCategory(id: number): Promise<void> {
        const { data } = await axiosInstance.delete<void>(`${this.API_URL}/${id}`, { headers: headersJSON() });
        return data;
    }
}

export default new CategoryService('/categories');