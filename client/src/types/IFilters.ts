import { IFilterAttribute } from "./IFilterAttribute";

export interface IRange {
    min: number;
    max: number;
}

export interface IFilters {
    priceRange: IRange;
    attributes: IFilterAttribute[];
    maxPages: number;
}

