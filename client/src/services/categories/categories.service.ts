import { axiosInstance, headers, headersJSON } from "..";
import { ICategory } from "../../types/ICategory";
import { IFilterAttribute } from "../../types/IFilterAttribute";
import { Service } from "../service";
import { CreateCategoryDto } from "./dto/create-category.dto";

class CategoryService extends Service {

    async getAllCategories(): Promise<ICategory[]> {
        const { data } = await axiosInstance.get<ICategory[]>(this.API_URL, { headers: headersJSON() });
        return data;
    }

    async getCategoryByRouteName(categoryName: string): Promise<ICategory> {
        const { data } = await axiosInstance.get<ICategory>(`${this.API_URL}/category=${categoryName}`, { headers: headersJSON() });
        return data;
    }

    async getFilters(categoryId: number): Promise<IFilterAttribute[]> {
        const { data } = await axiosInstance.get<IFilterAttribute[]>(`${this.API_URL}/${categoryId}/filters`, { headers: headersJSON() });
        return data;
    }

    async createCategory(body: CreateCategoryDto): Promise<ICategory> {
        const { data } = await axiosInstance.post<ICategory>(`${this.API_URL}`, body, { headers: headersJSON() });
        return data;
    }

    async editCategory(id: number, body: CreateCategoryDto): Promise<ICategory> {
        console.log(body);
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