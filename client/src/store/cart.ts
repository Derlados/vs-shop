import { makeAutoObservable } from "mobx";
import orderService from "../services/order/order.service";
import sessionCartService from "../services/session-cart/session-cart.service";
import { ICartProduct } from "../types/ICartProduct";
import { IOrder } from "../types/IOrder";
import { IProduct } from "../types/IProduct";


class Cart {
    private readonly LOCAL_STORAGE_CART_ID = "CART_ID";
    cartId: string;
    cartProducts: ICartProduct[];
    isInit: boolean;

    constructor() {
        makeAutoObservable(this);

        this.cartId = localStorage.getItem(this.LOCAL_STORAGE_CART_ID) ?? '';
        this.cartProducts = [];
        this.isInit = false;
        this.init();
    }

    async init() {
        if (this.cartId) {
            try {
                this.cartProducts = await sessionCartService.getCart(this.cartId)
            } catch (ignored) { }
        } else {
            this.cartId = await sessionCartService.createCart();
            localStorage.setItem(this.LOCAL_STORAGE_CART_ID, this.cartId);
        }
        this.isInit = true;
    }

    get totalPrice(): number {
        let totalPrice = 0;
        for (const products of this.cartProducts) {
            totalPrice += products.product.price * products.count;
        }

        return totalPrice;
    }

    async addToCart(product: IProduct, count: number) {
        await sessionCartService.addProduct(this.cartId, product.id, count);
        this.cartProducts.push({ product: product, count: count });
    }

    async deleteFromCart(productId: number) {
        await sessionCartService.deleteProduct(this.cartId, productId);
        this.cartProducts = this.cartProducts.filter(cp => cp.product.id != productId);

    }

    async changeCount(productId: number, newCount: number) {
        const cartProduct = this.cartProducts.find(cp => cp.product.id == productId);
        if (cartProduct) {
            await sessionCartService.editProduct(this.cartId, productId, newCount);
            cartProduct.count = newCount;
        }
    }

    findById(id: number) {
        return this.cartProducts.find(cp => cp.product.id == id);
    }

    async clearProducts() {
        await sessionCartService.clearCart(this.cartId);
        this.cartProducts = [];
    }
}

export default new Cart();