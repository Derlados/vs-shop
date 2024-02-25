import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../magento_services/products/prodcuts.service";
import { IProduct } from "../../types/magento/IProduct";

class ShopStore {
  public products: IProduct[];
  public status: 'initial' | 'loading' | 'success' | 'error';

  constructor() {
    makeAutoObservable(this);
    this.products = [];
    this.status = 'initial';
  }

  async loadProductsByCategory(categoryId: number) {
    runInAction(() => this.status = 'loading');

    try {
      const products = await prodcutsService.getProductsByCategoryId(categoryId);

      runInAction(() => {
        this.products = products;
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }
}

export default new ShopStore();