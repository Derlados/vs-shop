import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../services/products/prodcuts.service";
import { IProduct } from "../../types/magento/IProduct";

const PAGE_SIZE = 16;

class ShopStore {
  public products: IProduct[];
  public currentCategoryId: number;
  public status: 'initial' | 'loading' | 'success' | 'error';
  public currentPage: number;
  public totalPages: number;

  constructor() {
    makeAutoObservable(this);
    this.products = [];
    this.status = 'initial';
    this.currentPage = 1;
  }

  selectCategory(categoryId: number) {
    this.currentCategoryId = categoryId;
    this.currentPage = 1;
    this.updateProducts();
  }

  selectPage(page: number) {
    this.currentPage = page;
    this.updateProducts();
  }

  async updateProducts() {
    runInAction(() => {
      this.status = 'loading';
    });

    try {
      const { items, total_count } = await prodcutsService.getProductsByCategoryId(
        this.currentCategoryId,
        this.currentPage,
        PAGE_SIZE,
      );

      runInAction(() => {
        this.products = items;
        this.totalPages = Math.ceil(total_count / PAGE_SIZE);
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }
}

export default new ShopStore();