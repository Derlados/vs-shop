import { IOrder } from "./IOrder";

export interface ISellerOrder extends IOrder {
    isComplete: boolean;
    createdAt: Date;
}