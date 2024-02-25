import { axiosInstance } from "../../services";
import { Service } from "../../services/service";
import { IManufacturer } from "../../types/magento/IManufacturer";
import { IProduct } from "../../types/magento/IProduct";

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
    return await this.execute(axiosInstance.get<IProduct[]>(`${this.apiUrl}`, { params: { searchCriteria } }));
  }

  async getManufacturers(): Promise<IManufacturer[]> {
    const manufacturers = await this.execute(axiosInstance.get<IManufacturer[]>(`${this.apiUrl}/attributes/manufacturer/options`));
    return manufacturers.filter(manufacturer => manufacturer.value !== '');
  }
}

export default new ProductsService('/products');