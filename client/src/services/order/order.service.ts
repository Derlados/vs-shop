import axios, { AxiosResponse } from "axios";
import { axiosInstance, headersAuthJson } from "..";
import { PageElements } from "../../lib/types/PageElements";
import { OrderSorts } from "../../store/order";
import { IOrder, OrderStatus } from "../../types/IOrder";
import { Service } from "../service";



class OrderService extends Service {

    async createOrder(order: IOrder): Promise<IOrder> {
        const { id, payment, status, createdAt: date, orderProducts, ...orderInfo } = order;
        const body = {
            ...orderInfo,
            payment: { id: order.payment.id },
            orderProducts: order.orderProducts.map(op => { return { id: op.product.id, count: op.count } })
        }

        const data = await this.execute<IOrder>(axiosInstance.post(this.apiUrl, body, { headers: headersAuthJson() }));
        return data;
    }

    async getOrders(page?: number, startDate?: Date, endDate?: Date, sort?: OrderSorts, search?: string): Promise<PageElements<IOrder>> {
        const params = {
            page: page,
            startDate: startDate?.toLocaleDateString('en-CA'),
            endDate: endDate?.toLocaleDateString('en-CA'),
            sort: sort,
            search: search ? encodeURI(search) : undefined
        }

        const { data } = await axiosInstance.get<PageElements<IOrder>>(this.apiUrl, { params: params, headers: headersAuthJson() });
        data.elements.forEach(order => order.createdAt = new Date(order.createdAt));
        return data;
    }
}

export default new OrderService('/orders');

