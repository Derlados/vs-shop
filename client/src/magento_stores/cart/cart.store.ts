import { makeAutoObservable, runInAction } from "mobx";
import cartService from "../../magento_services/cart/cart.service";
import { ICart } from "../../types/magento/ICart";
import { ITotals } from "../../types/magento/ITotals";

class CartStore {
    private readonly LOCAL_STORAGE_CART_ID = "cartId";

    private cartId: string;
    public status: 'initial' | 'loading' | 'success' | 'error';
    public cart: ICart;
    public totals: ITotals;

    constructor() {
        makeAutoObservable(this);

        this.cartId = localStorage.getItem(this.LOCAL_STORAGE_CART_ID) || '';
        this.status = 'initial';
    }

    async init() {
        runInAction(() => this.status = 'loading');

        try {
            if (!this.cartId) {
                this.cartId = await cartService.createCartId();
                localStorage.setItem(this.LOCAL_STORAGE_CART_ID, this.cartId);
            }

            const [cart, totals] = await Promise.all([
                cartService.getCart(this.cartId),
                cartService.getTotals(this.cartId)
            ]);

            runInAction(() => {
                this.cart = cart as ICart;
                this.totals = totals as ITotals;
                this.status = 'success';
            });
        } catch (error) {
            runInAction(() => this.status = 'error');
        }
    }

    async addProductToCart(sku: string, quantity: number) {
        runInAction(() => this.status = 'loading');

        try {
            const res = await cartService.addItem(this.cartId, sku, quantity);
            const updatedItems = [...this.cart.items, res];

            runInAction(() => {
                this.cart.items = updatedItems;
                this.status = 'success';
            });
        } catch (error) {
            runInAction(() => this.status = 'error');
        }
    }

    async updateItemInCart(itemId: number, quantity: number) {
        runInAction(() => this.status = 'loading');

        try {
            const res = await cartService.updateItem(this.cartId, itemId, quantity);
            const updatedItems = this.cart.items.map(item => item.item_id === res.item_id ? res : item);

            runInAction(() => {
                this.cart.items = updatedItems;
                this.status = 'success';
            });
        } catch (error) {
            runInAction(() => this.status = 'error');
        }
    }

    async removeItemFromCart(itemId: number) {
        runInAction(() => this.status = 'loading');

        try {
            await cartService.deleteItem(this.cartId, itemId);

            runInAction(() => {
                this.cart.items = this.cart.items.filter(item => item.item_id !== itemId);
                this.status = 'success';
            });
        } catch (error) {
            runInAction(() => this.status = 'error');
        }
    }

    async clearCart() {
        localStorage.removeItem(this.LOCAL_STORAGE_CART_ID);
        this.cartId = '';

        const promise1 = Promise.resolve(3);
        const promise2 = '42';
        const promise3 = new Promise((resolve, reject) => {
            setTimeout(resolve, 100, 'foo');
        });

        const [t, t2, tw] = await Promise.all([promise1, promise2, promise3]);
    }
}

export default new CartStore();