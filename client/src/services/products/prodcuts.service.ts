import { axiosInstance } from "..";
import { Service } from "../service";
import { IManufacturer } from "../../types/magento/IManufacturer";
import { IProduct } from "../../types/magento/IProduct";
import { IGetProductsResDto } from "./dto/get-products-res.dto";
import { IFilterGroup } from "../../types/magento/IFilterGroup";

class ProductsService extends Service {
  async getProductBySku(sku: string): Promise<IProduct> {
    return await this.execute(axiosInstance.get<IProduct>(`${this.apiUrl}/${sku}`));
  }

  async getProductsByCategoryId(
    categoryId: number,
    page: number,
    pageSize: number,
    filterGroups: IFilterGroup[] = [],
    search: string = ''
  ): Promise<IGetProductsResDto> {
    const searchCriteria = this.createSearchCriteria(categoryId, page, pageSize, filterGroups, search);

    const data = await this.execute(axiosInstance.get<IGetProductsResDto>(`${this.apiUrl}`, { params: searchCriteria }));

    return data;
  }

  async getManufacturers(): Promise<IManufacturer[]> {
    const manufacturers = await this.execute(axiosInstance.get<IManufacturer[]>(`${this.apiUrl}/attributes/manufacturer/options`));
    return manufacturers.filter(manufacturer => manufacturer.value !== '');
  }


  private createSearchCriteria(
    categoryId: number,
    currentPage: number,
    pageSize: number,
    filterGroups: IFilterGroup[] = [],
    search: string = ''
  ) {

    const searchCriteria: any = {
      "searchCriteria[pageSize]": pageSize,
      "searchCriteria[currentPage]": currentPage,
      "searchCriteria[filter_groups][0][filters][0][field]": 'category_id',
      "searchCriteria[filter_groups][0][filters][0][value]": categoryId,
      "searchCriteria[filter_groups][0][filters][0][condition_type]": 'eq'
    };

    for (let i = 0; i < filterGroups.length; i++) {
      for (let j = 0; j < filterGroups[i].filters.length; j++) {
        const filter = filterGroups[i].filters[j];
        searchCriteria[`searchCriteria[filter_groups][${i + 1}][filters][${j}][field]`] = filter.field;
        searchCriteria[`searchCriteria[filter_groups][${i + 1}][filters][${j}][value]`] = filter.value;
        searchCriteria[`searchCriteria[filter_groups][${i + 1}][filters][${j}][condition_type]`] = filter.conditionType;
      }
    }

    if (search !== '') {
      searchCriteria[`searchCriteria[filter_groups][${filterGroups.length + 1}][filters][0][field]`] = 'name';
      searchCriteria[`searchCriteria[filter_groups][${filterGroups.length + 1}][filters][0][value]`] = `%${search}%`;
      searchCriteria[`searchCriteria[filter_groups][${filterGroups.length + 1}][filters][0][condition_type]`] = 'like';
    }

    return searchCriteria;
  }
}



export default new ProductsService('/products');