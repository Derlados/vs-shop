import { IMapEntry } from "mobx";
import { ICartProduct } from "./ICartProduct";

export interface IOrder {
    id: number;
    client: string;
    phone: string;
    email?: string;
    address: string;
    additionalInfo: string;
    totalPrice: number;
    payment: IPayment;
    orderProducts: ICartProduct[];
    status: OrderStatus;
    createdAt: Date;
}

export interface IPayment {
    id: number;
    method: string;
}

export enum OrderStatus {
    NOT_PROCESSED = 'Не оброблено',
    PROCESSING = 'Обробляється',
    PROCESSED = 'Сплачено'
}