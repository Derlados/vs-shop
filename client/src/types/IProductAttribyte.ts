import { IAttribute } from "./IAttribute";
import { IValue } from "./IValue";

export interface IProductAttribute {
    id: number;
    name: string;
    value: IValue;
}