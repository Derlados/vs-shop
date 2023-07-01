import { makeAutoObservable, runInAction } from "mobx";
import orderService from "../../services/order/order.service";
import sessionCartService from "../../services/session-cart/session-cart.service";
import { ICartProduct } from "../../types/ICartProduct";
import { IPayment, OrderStatus } from "../../types/IOrder";
import { REGEX } from "../../values/regex";
import cart from "../cart/cart";

export enum CheckoutStoreStatus {
    initial, initializing, loading, placing, updatingCart, failure, placingFailure, updatingCartFailure, success, placingSuccess, updatingCartSuccess
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

    public isTriedToPlace: boolean;

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
        this.isTriedToPlace = false;
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
        runInAction(() => this.isTriedToPlace = true);
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
        this.isTriedToPlace = false;
    }

    onLastNameChange(lastName: string) {
        this.lastName = lastName;
        this.isTriedToPlace = false;
    }

    onEmailChange(email: string) {
        this.email = email;
        this.isTriedToPlace = false;
    }

    onPhoneChange(phone: string) {
        this.phone = phone;
        this.isTriedToPlace = false;
    }

    onSettlementChange(settlement: string) {
        this.settlement = settlement;
        this.warehouse = '';
        this.isTriedToPlace = false;
    }

    onWarehouseChange(warehouse: string) {
        this.warehouse = warehouse;
        this.isTriedToPlace = false;
    }

    onAdditionalInfoChange(additionalInfo: string) {
        this.additionalInfo = additionalInfo;
        this.isTriedToPlace = false;
    }

    onPaymentChange(payment: IPayment) {
        this.payment = payment;
        this.isTriedToPlace = false;
    }

    async onCartUpdated() {
        this.cartProducts = [...cart.cartProducts];
    }
}

export default new CheckoutStore();