import { ICartProduct } from "./ICartProuct";

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