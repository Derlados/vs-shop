import { IPriceRange } from "../../../types/magento/IPriceRange";

export interface ISelectedFilter {
  attributeCode: string;
  values: string[];
}

export interface ISelectedFiltersDTo {
  attributeFilters: ISelectedFilter[];
  priceRange: IPriceRange;
  search: string;
}