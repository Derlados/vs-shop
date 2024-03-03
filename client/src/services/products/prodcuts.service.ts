import { axiosInstance } from "..";
import { Service } from "../service";
import { IManufacturer } from "../../types/magento/IManufacturer";
import { IProduct } from "../../types/magento/IProduct";
import { IGetProductsResDto } from "./dto/get-products-res.dto";

class ProductsService extends Service {
  async getProductBySku(sku: string): Promise<IProduct> {
    return await this.execute(axiosInstance.get<IProduct>(`${this.apiUrl}/${sku}`));
  }

  async getProductsByCategoryId(categoryId: number): Promise<IProduct[]> {
    const searchCriteria = {
      filterGroups: [
        {
          filters: [
            {
              field: 'category_id',
              value: categoryId,
              conditionType: 'eq'
            }
          ]
        }
      ]
    };
    const data = await this.execute(axiosInstance.get<IGetProductsResDto>(`${this.apiUrl}`, { params: { searchCriteria } }));

    return data.items;
  }

  async getManufacturers(): Promise<IManufacturer[]> {
    const manufacturers = await this.execute(axiosInstance.get<IManufacturer[]>(`${this.apiUrl}/attributes/manufacturer/options`));
    return manufacturers.filter(manufacturer => manufacturer.value !== '');
  }
}

export default new ProductsService('/products');