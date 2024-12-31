import { IPriceRange } from "../../../types/magento/IPriceRange";

export interface ISelectedFilter {
  attributeCode: string;
  values: string[];
}

export interface ISelectedFiltersDTO {
  attributeFilters: ISelectedFilter[];
  priceRange: IPriceRange;
  search: string;
}