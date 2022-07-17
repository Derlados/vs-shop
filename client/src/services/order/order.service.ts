import axios, { AxiosResponse } from "axios";
import { axiosInstance, headersJSON } from "..";
import { IOrder } from "../../types/IOrder";
import { Service } from "../service";

class OrderService extends Service {

    async createOrder(order: IOrder): Promise<IOrder> {
        const { id, payment, status, createdAt: date, orderProducts, ...orderInfo } = order;
        const body = {
            ...orderInfo,
            payment: { id: order.payment.id },
            orderProducts: order.orderProducts.map(op => { return { id: op.product.id, count: op.count } })
        }

        const data = await this.execute<IOrder>(axiosInstance.post(this.API_URL, body, { headers: headersJSON() }));
        return data;
    }

    async getAll(): Promise<IOrder[]> {
        const { data } = await axiosInstance.get<IOrder[]>(this.API_URL, { headers: headersJSON() });
        data.forEach(order => order.createdAt = new Date(order.createdAt ?? ''));
        return data;
    }


}

export default new OrderService('/orders');

