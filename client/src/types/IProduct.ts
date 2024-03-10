import { IImage } from "./IImage";
import { IProductAttribute } from "./IProductAttribyte";
import { StockStatus } from "./magento/IProduct";

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
    availability: StockStatus;
    categoryId: number;
    userId: number;
    discountPercent: number;
    attributes: IProductAttribute[];
    images: IImage[];
}

