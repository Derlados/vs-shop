import { IAttribute } from "./IAttribute";

export interface IFilterAttribute {
    attribute: IAttribute;
    isRange: boolean;
    step: number;
}

export interface IFullFilter {
    attributes: IFilterAttribute[];
    pages: number;
    minPrice: number;
    maxPrice: number;
}