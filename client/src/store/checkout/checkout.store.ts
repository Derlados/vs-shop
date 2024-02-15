import { makeAutoObservable, runInAction } from "mobx";
import orderService from "../../services/order/order.service";
import sessionCartService from "../../services/cart/cart.service";
import { ICartProduct } from "../../types/ICartProduct";
import { IPayment, OrderStatus } from "../../types/IOrder";
import { REGEX } from "../../values/regex";
import cart from "../cart/cart";

export enum CheckoutStoreStatus {
    initial, initializing, loading, placing, failure, placingFailure, success, placingSuccess
}

export class CheckoutStore {
    public status: CheckoutStoreStatus;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phone: string;
    public settlement: string;
    public warehouse: string;
    public additionalInfo: string;
    public payment: IPayment;
    public cartProducts: ICartProduct[];

    public isTrienToPlace: boolean;

    get totalPrice(): number {
        let totalPrice = 0;
        for (const products of this.cartProducts) {
            totalPrice += products.product.price * products.count;
        }

        return totalPrice;
    }

    get isValid(): boolean {
        return this.firstName !== '' && this.lastName !== '' && REGEX.PHONE_REGEX.test(this.phone)
            && (this.email == '' || REGEX.EMAIL_REGEX.test(this.email)) && this.settlement !== '' && this.warehouse !== '';
    }

    constructor() {
        makeAutoObservable(this);
        this.status = CheckoutStoreStatus.initial;
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.phone = '';
        this.settlement = '';
        this.warehouse = '';
        this.additionalInfo = '';
        this.isTrienToPlace = false;
    }

    async init(cartId: string) {
        if (this.status == CheckoutStoreStatus.initializing) {
            return;
        }

        runInAction(() => this.status = CheckoutStoreStatus.initializing);

        try {
            const cartProducts = await sessionCartService.getCart(cartId);

            runInAction(() => {
                this.cartProducts = cartProducts;
                this.status = CheckoutStoreStatus.success;
            });
        } catch (e) {
            runInAction(() => this.status = CheckoutStoreStatus.failure);
        }
    }

    async accept() {
        runInAction(() => this.isTrienToPlace = true);
        if (!this.isValid || this.status == CheckoutStoreStatus.placing) {
            return;
        }

        runInAction(() => this.status = CheckoutStoreStatus.placing);

        try {
            await orderService.createOrder({
                id: -1,
                client: `${this.firstName} ${this.lastName}`,
                phone: this.phone,
                email: this.email != '' ? this.email : undefined,
                address: `${this.settlement} - ${this.warehouse}`,
                additionalInfo: this.additionalInfo,
                totalPrice: this.totalPrice,
                orderProducts: this.cartProducts,
                payment: { id: 1, method: 'Накладенний платіж' },
                createdAt: new Date(),
                status: OrderStatus.NOT_PROCESSED
            });
            cart.clearUserProducts();

            runInAction(() => this.status = CheckoutStoreStatus.placingSuccess);
        } catch (e) {
            runInAction(() => this.status = CheckoutStoreStatus.placingFailure);
        }
    }

    onFirstNameChange(firstName: string) {
        this.firstName = firstName;
        this.isTrienToPlace = false;
    }

    onLastNameChange(lastName: string) {
        this.lastName = lastName;
        this.isTrienToPlace = false;
    }

    onEmailChange(email: string) {
        this.email = email;
        this.isTrienToPlace = false;
    }

    onPhoneChange(phone: string) {
        this.phone = phone;
        this.isTrienToPlace = false;
    }

    onSettlementChange(settlement: string) {
        this.settlement = settlement;
        this.warehouse = '';
        this.isTrienToPlace = false;
    }

    onWarehouseChange(warehouse: string) {
        this.warehouse = warehouse;
        this.isTrienToPlace = false;
    }

    onAdditionalInfoChange(additionalInfo: string) {
        this.additionalInfo = additionalInfo;
        this.isTrienToPlace = false;
    }

    onPaymentChange(payment: IPayment) {
        this.payment = payment;
        this.isTrienToPlace = false;
    }

    onOrderProductsChangeAmount(productId: number, newCount: number) {
        const cartProduct = this.cartProducts.find(cp => cp.product.id == productId);
        if (cartProduct) {
            cartProduct.count = newCount;
        }

        this.cartProducts = [...this.cartProducts];
        this.isTrienToPlace = false;
    }
}

export default new CheckoutStore();