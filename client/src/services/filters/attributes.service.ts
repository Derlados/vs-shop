import { axiosInstance } from "..";
import { IDisplayFilter } from "../../types/magento/IDisplayFilter";
import { Service } from "../service";

class FiltersService extends Service {
  async getAttributesByAttributeSet(categoryId: number) {
    return await this.execute(axiosInstance.get<IDisplayFilter[]>(
      `${this.apiUrl}/${categoryId}/filters`
    ));
  }
}



export default new FiltersService('/vs-shop/categories');