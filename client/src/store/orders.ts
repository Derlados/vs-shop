import orderService from "../services/order.service";
import { IOrder } from "../types/IOrder";

class OrderStore {
    orders: IOrder[];

    constructor() {
        this.orders = [];
    }

    async init() {
        this.orders = await orderService.getAll();
    }

}

export default new OrderStore();