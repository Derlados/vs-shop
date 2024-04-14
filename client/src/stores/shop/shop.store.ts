import { makeAutoObservable, runInAction } from "mobx";
import prodcutsService from "../../services/products/prodcuts.service";
import { IFilterGroup } from "../../types/magento/IFilterGroup";
import { IProduct } from "../../types/magento/IProduct";

const PAGE_SIZE = 16;

class ShopStore {
  public products: IProduct[];
  public currentCategoryId: number;
  public status: 'initial' | 'loading' | 'success' | 'error';
  public currentPage: number;
  public totalPages: number;
  public search: string;
  public isInit: boolean;

  constructor() {
    makeAutoObservable(this);
    this.products = [];
    this.status = 'initial';
    this.currentCategoryId = 0;
    this.currentPage = 1;
    this.totalPages = 0;
    this.search = '';
    this.isInit = false;
  }

  selectCategory(categoryId: number) {
    runInAction(() => {
      this.currentCategoryId = categoryId;
    });
  }

  changeSearch(search: string) {
    runInAction(() => {
      this.search = search;
      this.currentPage = 1;
    });
  }

  selectPage(page: number) {
    runInAction(() => {
      this.currentPage = page;
    });
  }

  async updateProducts(selectedFilters: IFilterGroup[] = [], options?: { clearPage?: boolean }) {
    runInAction(() => {
      this.status = 'loading';
    });

    try {
      const { items, total_count } = await prodcutsService.getProductsByCategoryId(
        this.currentCategoryId,
        options?.clearPage ? 1 : this.currentPage,
        PAGE_SIZE,
        selectedFilters,
        this.search
      );

      runInAction(() => {
        this.products = items;
        this.totalPages = Math.ceil(total_count / PAGE_SIZE);
        this.status = 'success';
        this.currentPage = options?.clearPage ? 1 : this.currentPage;
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }
}

export default new ShopStore();