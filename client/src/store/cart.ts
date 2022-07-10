import { makeAutoObservable } from "mobx";
import orderService from "../services/order/order.service";
import { ICartProduct } from "../types/ICartProuct";
import { IOrder } from "../types/IOrder";
import { IProduct } from "../types/IProduct";


class Cart {
    cartProducts: ICartProduct[];

    constructor() {
        makeAutoObservable(this);
        this.cartProducts = [];
    }

    get totalPrice(): number {
        let totalPrice = 0;
        for (const products of this.cartProducts) {
            totalPrice += products.product.price * products.count;
        }

        return totalPrice;
    }

    addToCart(product: IProduct, count: number) {
        this.cartProducts.push({ product: product, count: count });
    }

    deleteFromCart(id: number) {
        this.cartProducts = this.cartProducts.filter(cp => cp.product.id != id);

    }

    findById(id: number) {
        return this.cartProducts.find(cp => cp.product.id == id);
    }

    async completeOrder(order: IOrder) {
        const createdOrder = await orderService.createOrder(order);
        if (createdOrder) {
            this.cartProducts = [];
        }
    }

    clearProducts() {
        this.cartProducts = [];
    }

    private saveCartLocal() {

    }
}

export default new Cart();