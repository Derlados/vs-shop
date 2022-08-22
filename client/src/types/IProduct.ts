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
    IN_STOCK = 'В наявності',
    IN_STOKE_FEW = 'Закінчується',
    OUT_OF_STOCK = 'Немає в наявності'
}
