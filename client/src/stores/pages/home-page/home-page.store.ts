import { makeAutoObservable, runInAction } from "mobx";
import { IProduct } from "../../../types/magento/IProduct";
import prodcutsService from "../../../services/products/prodcuts.service";

class ShopPageStore {
  public status: 'initial' | 'loading' | 'success' | 'error';
  public favoriteProducts: IProduct[];

  constructor() {
    makeAutoObservable(this);

    this.favoriteProducts = [];
  }

  async init() {
    runInAction(() => {
      this.status = 'loading';
    });

    try {
      const res = await prodcutsService.getProductsByCategoryId(3);
      const favoriteProducts = res.items;

      runInAction(() => {
        this.favoriteProducts = favoriteProducts;
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => {
        this.status = 'error';
      });
    }
  }
}

export default new ShopPageStore();