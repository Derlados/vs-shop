import { makeAutoObservable, runInAction } from "mobx";
import { SortType } from "../../enums/SortType.enum";
import attributesService from "../../services/filters/attributes.service";
import { IDisplayFilter } from "../../types/magento/IDisplayFilter";
import { IFilterGroup } from "../../types/magento/IFilterGroup";
import { IUserSelectedFilter } from "../../types/magento/IUserSelectedFilter";

class FiltersStore {
  public status: 'initial' | 'loading' | 'success' | 'error';
  public filters: IDisplayFilter[];
  public selectedFilters: IUserSelectedFilter[];
  public selectedPriceRange: { min: number, max: number };
  public priceRange: { min: number, max: number };
  public selectedSort: SortType;

  constructor() {
    makeAutoObservable(this);
    this.setDefaultState();
  }

  get filterGroups(): IFilterGroup[] {
    const filterGroups: IFilterGroup[] = [];

    for (let i = 0; i < this.selectedFilters.length; i++) {
      filterGroups.push({
        filters: this.selectedFilters[i].values.map(value => ({
          field: this.selectedFilters[i].attributeCode,
          value,
          conditionType: 'eq'
        }))
      });
    }

    if (this.selectedPriceRange.min !== this.priceRange.min || this.selectedPriceRange.max !== this.priceRange.max) {
      filterGroups.push({
        filters: [
          {
            field: 'price',
            value: `${this.selectedPriceRange.min}`,
            conditionType: 'from'
          }
        ]
      }, {
        filters: [
          {
            field: 'price',
            value: `${this.selectedPriceRange.max}`,
            conditionType: 'to'
          }
        ]
      });
    }

    return filterGroups;
  }

  async loadFilters(categoryId: number) {
    runInAction(() => {
      this.status = 'loading';
    });

    try {
      const filters = await attributesService.getAttributesByAttributeSet(categoryId);

      const priceFilter = filters.find(f => f.attribute_code === 'price');
      const checkedFilters = filters.filter(f => f.attribute_code !== 'price');

      const priceRange = {
        min: Number(priceFilter?.values[0]) ?? 0,
        max: Number(priceFilter?.values[1]) ?? 0
      };

      runInAction(() => {
        this.filters = checkedFilters;
        this.priceRange = { ...priceRange };
        this.status = 'success';
        this.selectedPriceRange = { ...priceRange };
      });
    } catch (error) {
      console.error(error);
    }
  }

  selectFilter(attributeCode: string, value: string, checked: boolean) {
    const filter = this.selectedFilters.find(f => f.attributeCode === attributeCode);
    if (!filter) {
      if (!checked) return;

      this.selectedFilters.push({
        attributeCode,
        values: [value]
      });

      return;
    }

    if (checked) {
      filter!.values.push(value);
    } else {
      filter!.values = filter!.values.filter(v => v !== value);
    }
  }

  changePriceRange(min: number, max: number) {
    this.selectedPriceRange = { min, max };
  }

  setDefaultState() {
    this.status = 'initial';
    this.selectedFilters = [];
    this.priceRange = { min: 0, max: 0 };
    this.selectedPriceRange = { min: 0, max: 0 };
    this.filters = [];
    this.selectedSort = SortType.NOT_SELECTED;
  }
}

export default new FiltersStore();