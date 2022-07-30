import { IImage } from "./IImage";

export interface IProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    oldPrice: number;
    isNew: boolean;
    isBestseller: boolean;
    count: number;
    categoryId: number;
    userId: number;
    discountPercent: number;
    attributes: Map<string, string>;
    images: IImage[];
}
