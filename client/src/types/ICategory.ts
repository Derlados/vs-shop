import { IAttribute } from "./IAttribute";

export interface ICategory {
    id: number;
    name: string;
    img: string;
    routeName: string;
    keyAttributes: IAttribute[];
    productsCount?: number;
}