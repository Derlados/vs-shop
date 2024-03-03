import axios from "axios";
import { axiosInstance } from "..";
import { Service } from "../service";
import { ICategory } from "../../types/magento/ICategory";
import { ICategoryList } from "../../types/magento/ICategoryList";

class CategoriesService extends Service {
    async getCategoryList(): Promise<ICategory[]> {
        const categories = await this.execute(axiosInstance.get<ICategory[]>('/vs-shop/categories/all'));

        return categories.filter(category => category.level > 1);
    }

    async getCategoryTree(): Promise<ICategoryList> {
        return await this.execute(axiosInstance.get<ICategoryList>(this.apiUrl));
    }

    async getCategoryById(categoryId: number): Promise<ICategory> {
        return await this.execute(axiosInstance.get<ICategory>(`${this.apiUrl}/${categoryId}`));
    }
}

export default new CategoriesService('/categories');