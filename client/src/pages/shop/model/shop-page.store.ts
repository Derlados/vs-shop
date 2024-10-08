import { makeAutoObservable, runInAction } from "mobx";
import { ICategory } from "../../../types/magento/ICategory";
import catalogStore from "../../../stores/catalog/catalog.store";
import { IProduct } from "../../../types/magento/IProduct";
import { IFilterGroup } from "../../../types/magento/IFilterGroup";
import prodcutsService from "../../../services/products/prodcuts.service";
import { IFilterCategory } from "../ui/Filters/FilterCategories/FilterCategories";

const PAGE_SIZE = 16;

class ShopPageStore {
  public status: 'initial' | 'loading' | 'success' | 'error';
  public isFilterOpen: boolean;
  public isValidCategory: boolean;
  public filterCategories: IFilterCategory[];
  public category: ICategory | undefined;
  public products: IProduct[];
  public currentCategoryId: number;
  public currentPage: number;
  public totalPages: number;
  public search: string;
  public isInit: boolean;

  constructor() {
    makeAutoObservable(this);
    this.setDefaultState();
  }

  init(categoryPath?: string) {
    if (!categoryPath) {
      this.isValidCategory = false;
      return;
    }

    const category = catalogStore.getCategoryByUrl(categoryPath);
    if (!category) {
      this.isValidCategory = false;
      return;
    }

    this.category = category;
    this.currentCategoryId = category.id;
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
    if (page < 1 || page > this.totalPages) {
      return;
    }

    runInAction(() => {
      this.currentPage = page;
    });
  }

  openFilters() {
    this.isFilterOpen = true;
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

  setDefaultState() {
    this.status = 'initial';
    this.isFilterOpen = false;
    this.isValidCategory = true;
    this.filterCategories = [];
    this.category = undefined;
    this.products = [];
    this.currentCategoryId = 0;
    this.currentPage = 1;
    this.totalPages = 0;
    this.search = '';
  }
}

export default new ShopPageStore();