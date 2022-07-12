import { ICartProduct } from "./ICartProduct";

export interface IOrder {
    client: string;
    phone: string;
    email: string;
    address: string;
    additionalInfo: string;
    totalPrice: number;
    isComplete: boolean;
    orderProducts: ICartProduct[];
}