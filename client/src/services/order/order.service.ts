import axios, { AxiosResponse } from "axios";
import { axiosInstance, headersJSON } from "..";
import { IOrder } from "../../types/IOrder";
import { Service } from "../service";

class OrderService extends Service {

    async createOrder(order: IOrder): Promise<IOrder> {
        const body = {
            client: order.client,
            phone: order.phone,
            email: order.email,
            address: order.address,
            additionalInfo: order.additionalInfo,
            totalPrice: order.totalPrice,
            orderProducts: order.orderProducts.map(op => { return { id: op.product.id, count: op.count } })
        }

        const data = await this.execute<IOrder>(axiosInstance.post(this.API_URL, body, { headers: headersJSON() }));
        return data;
    }

    async getAll(): Promise<IOrder[]> {
        const { data } = await axiosInstance.get<IOrder[]>(this.API_URL, { headers: headersJSON() });
        return data;
    }


}

export default new OrderService('/orders');

