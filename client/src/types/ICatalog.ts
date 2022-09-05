import { ICategory } from "./ICategory";

export interface ICatalog {
    id: number;
    name: string;
    route: string;
    categories: ICategory[];
}