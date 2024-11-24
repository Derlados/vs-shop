import { axiosInstance } from "..";
import { IDisplayFilter } from "../../types/magento/IDisplayFilter";
import { Service } from "../service";
import { ISelectedFiltersDTo } from "./dto/selected-filters.dto";


class FiltersService extends Service {

  async getAttributesByAttributeSet(categoryId: number, selectedFilters: ISelectedFiltersDTo): Promise<IDisplayFilter[]> {
    return await this.execute(axiosInstance.post<IDisplayFilter[]>(
      `${this.apiUrl}/${categoryId}/filters`,
      selectedFilters
    ));
  }
}

export default new FiltersService('/vs-shop/categories');