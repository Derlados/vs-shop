import { IAttribute } from "./IAttribute";

export interface IFilterAttribute {
    attribute: IAttribute;
    isRange: boolean;
    step: number;
} 