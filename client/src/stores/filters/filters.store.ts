import { makeAutoObservable, runInAction } from "mobx";
import attributesService from "../../services/filters/attributes.service";
import { IDisplayFilter } from "../../types/magento/IDisplayFilter";
import { IUserSelectedFilter } from "../../types/magento/IUserSelectedFilter";

class FiltersStore {
  public status: 'initial' | 'loading' | 'success' | 'error';
  public filters: IDisplayFilter[];
  public selectedFilters: IUserSelectedFilter[];
  public selectedPriceRange: { min: number, max: number };
  public priceRange: { min: number, max: number };

  constructor() {
    makeAutoObservable(this);
    this.status = 'initial';
    this.selectedFilters = [];
    this.priceRange = { min: 0, max: 0 };
    this.selectedPriceRange = { min: 0, max: 0 };
    this.filters = [];
  }

  async loadFilters(categoryId: number, attributeSetId: number) {
    try {
      const filters = await attributesService.getAttributesByAttributeSet(categoryId, attributeSetId);

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
}

export default new FiltersStore();