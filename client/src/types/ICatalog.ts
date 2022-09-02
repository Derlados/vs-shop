import { ICategory } from "./ICategory";

export interface ICatalog {
    id: number;
    name: string;
    categories: ICategory[];
}