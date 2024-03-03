import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../services/products/prodcuts.service";
import { IProduct } from "../../types/magento/IProduct";

class ShopStore {
  public products: IProduct[];
  public curretnCategoryId: number;
  public status: 'initial' | 'loading' | 'success' | 'error';

  constructor() {
    makeAutoObservable(this);
    this.products = [];
    this.status = 'initial';
  }

  async selectCategory(categoryId: number) {
    runInAction(() => {
      this.status = 'loading';
      this.curretnCategoryId = categoryId;
    });

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