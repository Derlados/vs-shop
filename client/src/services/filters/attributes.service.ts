import qs from "qs";
import { axiosInstance } from "..";
import { IDisplayFilter } from "../../types/magento/IDisplayFilter";
import { Service } from "../service";
import { ISelectedFiltersDTO } from "./dto/selected-filters.dto";


class FiltersService extends Service {

  async getAttributesByAttributeSet(categoryId: number, selectedFilters: ISelectedFiltersDTO): Promise<IDisplayFilter[]> {
    return await this.execute(axiosInstance.get<IDisplayFilter[]>(
      `${this.apiUrl}/${categoryId}/filters?${this.convertToParams(selectedFilters)}`
    ));
  }

  convertToParams(dto: ISelectedFiltersDTO): string {
    const params: any = {
      minPrice: dto.priceRange.min,
      maxPrice: dto.priceRange.max,
      search: dto.search,
    };

    dto.attributeFilters.forEach((filter) => {
      params[filter.attributeCode] = filter.values;
    });
    
    return qs.stringify(params);
  }
  
}

export default new FiltersService('/vs-shop/categories');