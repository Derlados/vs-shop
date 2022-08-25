import { IAttribute } from "./IAttribute";

export interface ICategory {
    id: number;
    name: string;
    img: string;
    isNew: boolean;
    routeName: string;
    keyAttributes: IAttribute[];
    productsCount?: number;
}