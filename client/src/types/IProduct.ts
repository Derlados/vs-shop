import { IImage } from "./IImage";

export interface IProduct {
    id: number;
    title: string;
    description: string;
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
    attributes: Map<string, string>;
    images: IImage[];
}

export enum AvailableStatus {
    IN_STOCK = 'В наявності',
    IN_STOKE_FEW = 'Закінчується',
    OUT_OF_STOCK = 'Немає в наявності'
}
