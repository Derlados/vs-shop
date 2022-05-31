import { axiosInstance, headersJSON } from ".";
import { IOrder } from "../types/IOrder";
import { Service } from "./service";

class OrderService extends Service {

    async createOrder(order: IOrder): Promise<IOrder> {
        const { data } = await axiosInstance.post<IOrder>(this.API_URL, { headers: headersJSON() });
        return data;
    }

    async getAll(): Promise<IOrder[]> {
        const { data } = await axiosInstance.get<IOrder[]>(this.API_URL, { headers: headersJSON() });
        return data;
    }
}

export default new OrderService('/orders');

