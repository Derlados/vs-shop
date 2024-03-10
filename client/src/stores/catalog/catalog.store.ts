import { makeAutoObservable, runInAction } from "mobx";
import categoryHelper from "../../helpers/category.helper";
import categoriesService from "../../services/categories/categories.service";
import prodcutsService from "../../services/products/prodcuts.service";
import { ICategory } from "../../types/magento/ICategory";
import { ICategoryList } from "../../types/magento/ICategoryList";
import { IManufacturer } from "../../types/magento/IManufacturer";

class CatalogStore {
  public manufacturers: IManufacturer[];
  public categoryTree: ICategoryList | null;
  public categoryList: ICategory[];
  public status: 'initial' | 'loading' | 'success' | 'error';
  public isInit: boolean;

  constructor() {
    makeAutoObservable(this);

    this.manufacturers = [];
    this.categoryTree = null;
    this.categoryList = [];
    this.status = 'initial';
    this.isInit = false;
  }

  async init() {
    runInAction(() => this.status = 'loading');

    try {
      const categoryList = await categoriesService.getCategoryList();
      const categoryTree = await categoriesService.getCategoryTree();
      const manufacturers = await prodcutsService.getManufacturers();

      runInAction(() => {
        this.manufacturers = manufacturers;
        this.categoryTree = categoryTree;
        this.categoryList = categoryList;
        this.status = 'success';
        this.isInit = true;
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  getCategoryProductsCount(categoryId: number): number {
    return this.categoryTree?.children_data.find(category => category.id === categoryId)?.product_count || 0;
  }

  getCategoryById(categoryId: number): ICategory | undefined {
    return this.categoryList.find(category => category.id === categoryId);
  }

  getCategoryByUrl(categoryUrl: string): ICategory | undefined {
    return this.categoryList.find(category => categoryHelper.getUrlPath(category) === categoryUrl);
  }
}

export default new CatalogStore();