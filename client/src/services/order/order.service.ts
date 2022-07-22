import axios, { AxiosResponse } from "axios";
import { axiosInstance, headersJSON } from "..";
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

        const data = await this.execute<IOrder>(axiosInstance.post(this.API_URL, body, { headers: headersJSON() }));
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

        const { data } = await axiosInstance.get<PageElements<IOrder>>(this.API_URL, { params: params, headers: headersJSON() });
        data.elements.forEach(order => order.createdAt = new Date(order.createdAt));
        return data;
    }

    async changeOrderStatus(id: number, newStatus: OrderStatus): Promise<OrderStatus> {
        const body = { status: newStatus };
        const { data } = await axiosInstance.put(`${this.API_URL}/${id}/status`, body, { headers: headersJSON() });
        return data.updatedStatus;
    }

    async deleteSelectedOrders(ids: number[]): Promise<void> {
        const body = { toDeleteIds: ids }
        const { data } = await this.execute(axiosInstance.put(this.API_URL, body, { headers: headersJSON() }));
        return data;
    }
}

export default new OrderService('/orders');

