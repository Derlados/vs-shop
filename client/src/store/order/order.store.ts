import orderService from "../../services/order/order.service";
import sessionCartService from "../../services/session-cart/session-cart.service";
import { ICartProduct } from "../../types/ICartProduct";
import { IPayment, OrderStatus } from "../../types/IOrder";

enum OrderStoreStatus {
    initial, loading, failure, success
}

class OrderStore {
    public status: OrderStoreStatus;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public address: string;
    public additionalInfo: string;
    public payment: IPayment;
    public orderProducts: ICartProduct[];

    get totalPrice(): number {
        let totalPrice = 0;
        for (const products of this.orderProducts) {
            totalPrice += products.product.price * products.count;
        }

        return totalPrice;
    }

    constructor() {
        this.status = OrderStoreStatus.initial;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.additionalInfo = '';
    }

    async init(cartId: string) {
        this.status = OrderStoreStatus.loading;

        try {
            this.orderProducts = await sessionCartService.getCart(cartId);
            this.status = OrderStoreStatus.success;
        } catch (e) {
            this.status = OrderStoreStatus.failure;
        }
    }

    async accept() {
        this.status = OrderStoreStatus.loading;

        try {
            await orderService.createOrder({
                id: -1,
                client: `${this.firstName} ${this.lastName}`,
                phone: this.phone,
                email: this.email,
                address: this.address,
                additionalInfo: this.additionalInfo,
                totalPrice: this.totalPrice,
                payment: this.payment,
                orderProducts: this.orderProducts,
                status: OrderStatus.NOT_PROCESSED,
                createdAt: new Date()
            });

            this.status = OrderStoreStatus.success;
        } catch (e) {
            this.status = OrderStoreStatus.failure;
        }
    }


}

export default new OrderStore();