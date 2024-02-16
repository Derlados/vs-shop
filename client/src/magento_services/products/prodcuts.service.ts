import { axiosInstance } from "../../services";
import { Service } from "../../services/service";
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
}

export default new ProductsService('/products');