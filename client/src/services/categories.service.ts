import { axiosInstance, headersJSON } from ".";
import { ICategory } from "../types/ICategory";
import { IFilterAttribute } from "../types/IFilterAttribute";
import { Service } from "./service";

class CategoryService extends Service {

    async getAllCategories(): Promise<ICategory[]> {
        const { data } = await axiosInstance.get<ICategory[]>(this.API_URL, { headers: headersJSON() });
        return data;
    }

    async getCategoryByName(categoryName: string): Promise<ICategory> {
        const { data } = await axiosInstance.get<ICategory>(`${this.API_URL}/category=${categoryName}`, { headers: headersJSON() });
        return data;
    }

    async getFilters(categoryId: number): Promise<IFilterAttribute[]> {
        const { data } = await axiosInstance.get<IFilterAttribute[]>(`${this.API_URL}/${categoryId}/filters`, { headers: headersJSON() });
        return data;
    }
}

export default new CategoryService('/categories');