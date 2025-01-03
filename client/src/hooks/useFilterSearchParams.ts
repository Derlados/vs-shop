import { SortType } from "../enums/SortType.enum";
import { useEffect, useState } from "react";
import { IUserSelectedFilter } from "../types/magento/IUserSelectedFilter";

interface IFilterParams {
  page?: number;
  search?: string;
  sort?: SortType;
  minPrice?: number;
  maxPrice?: number;
  attributeFilters: IUserSelectedFilter[];
}

export default function useFilterSearchParams() {
  const getParams = (key: string, defaultValue: any) => new URLSearchParams(window.location.search).get(key) || defaultValue;

  const [params, setParams] = useState<IFilterParams>({
    page: getParams('page', null),
    search: getParams('search', null),
    sort: getParams('sort', null),
    minPrice: getParams('minPrice', null),
    maxPrice: getParams('maxPrice', null),
    attributeFilters: []
  });

  const initAttributeFilters = () => {
    const urlSearch = new URLSearchParams(window.location.search)
    const attributeFilters: { attributeCode: string, values: string[] }[] = [];
    const nonFilterKeys = ['page', 'search', 'sort', 'min_price', 'max_price'];

    urlSearch.forEach((value, key) => {
      if (nonFilterKeys.includes(key)) return;

      const values = value.split(',');
      attributeFilters.push({ attributeCode: key, values });
    });

    setParams({
      ...params,
      attributeFilters
    });
  }

  const setSearchParams = () => {
    const url = new URL(window.location.href.split('?')[0]);
    const keys = Object.keys(params) as (keyof IFilterParams)[];

    keys.forEach(key => {
      if (key === 'page' && params[key] === 1) return;
      if (key === 'search' && !params[key]) return;
      if (key === 'sort' && params[key] === SortType.NOT_SELECTED) return;
      if (key === 'attributeFilters') return;


      const value = params[key];
      if (value) {
        url.searchParams.set(key, value.toString());
      } else {
        url.searchParams.delete(key);
      }
    });

    params.attributeFilters.forEach(filter => {
      url.searchParams.set(filter.attributeCode, filter.values.join(','));
    });

    // replace url
    window.history.replaceState({}, '', url.toString());
  }

  const updateParams = (newParams: Partial<IFilterParams>) => {
    setParams({
      ...params,
      ...newParams,
    });
  }

  useEffect(() => {
    initAttributeFilters();
  }, []);

  useEffect(() => {
    setSearchParams();
  }, [params]);

  return [params, updateParams] as const;
}