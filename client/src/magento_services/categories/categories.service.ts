import axios from "axios";
import { axiosInstance } from "../../services";
import { Service } from "../../services/service";
import { ICategory } from "../../types/magento/ICategory";
import { ICategoryList } from "../../types/magento/ICategoryList";

class CategoriesService extends Service {
    async getCategoryList(): Promise<ICategoryList> {
        return await this.execute(axiosInstance.get<ICategoryList>(this.apiUrl));
    }

    async getCategoryById(categoryId: number): Promise<ICategory> {
        return await this.execute(axiosInstance.get<ICategory>(`${this.apiUrl}/${categoryId}`));
    }
}

export default new CategoriesService('/categories');