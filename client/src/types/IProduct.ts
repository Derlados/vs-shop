import { IImage } from "./IImage";
import { IProductAttribute } from "./IProductAttribyte";

export interface IProduct {
    id: number;
    title: string;
    brand: string;
    description: string;
    url: string;
    price: number;
    oldPrice: number;
    isNew: boolean;
    isBestseller: boolean;
    count?: number;
    maxByOrder: number;
    availability: AvailableStatus;
    categoryId: number;
    userId: number;
    discountPercent: number;
    attributes: IProductAttribute[];
    images: IImage[];
}

export enum AvailableStatus {
    OUT_OF_STOCK = 0,
    IN_STOCK = 1,
    IN_STOKE_FEW = 2
}
