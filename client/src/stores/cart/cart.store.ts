import { makeAutoObservable, runInAction } from "mobx";
import cartService from "../../services/cart/cart.service";
import { ICart } from "../../types/magento/ICart";
import { ITotals } from "../../types/magento/ITotals";

class CartStore {
  private readonly LOCAL_STORAGE_CART_ID = "cartId";

  private cartId: string;
  public status: 'initial' | 'loading' | 'success' | 'error';
  public cart: ICart;
  public totals?: ITotals;
  public isInit: boolean;
  public processingSkus: string;

  constructor() {
    makeAutoObservable(this);

    this.cartId = localStorage.getItem(this.LOCAL_STORAGE_CART_ID) || '';
    this.status = 'initial';
    this.isInit = false;
    this.processingSkus = '';
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
        this.isInit = true;
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  async addProduct(sku: string, quantity: number) {
    runInAction(() => {
      this.status = 'loading';
      this.processingSkus = sku;
    });

    try {
      const res = await cartService.addItem(this.cartId, sku, quantity);
      await this.updateTotals();
      const updatedItems = [...this.cart.items, res];

      runInAction(() => {
        this.cart.items = updatedItems;
        this.processingSkus = '';
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  async updateProduct(itemId: number, quantity: number) {
    runInAction(() => {
      this.status = 'loading';
      this.processingSkus = this.cart.items.find(item => item.item_id === itemId)?.sku || '';
    });

    try {
      const res = await cartService.updateItem(this.cartId, itemId, quantity);
      await this.updateTotals();
      const updatedItems = this.cart.items.map(item => item.item_id === res.item_id ? res : item);

      runInAction(() => {
        this.cart.items = updatedItems;
        this.processingSkus = '';
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  async removeProduct(itemId: number) {
    runInAction(() => {
      this.status = 'loading';
      this.processingSkus = this.cart.items.find(item => item.item_id === itemId)?.sku || '';
    });

    try {
      await cartService.deleteItem(this.cartId, itemId);
      await this.updateTotals();

      runInAction(() => {
        this.cart.items = this.cart.items.filter(item => item.item_id !== itemId);
        this.processingSkus = '';
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  private async updateTotals() {
    try {
      const totals = await cartService.getTotals(this.cartId);

      runInAction(() => {
        this.totals = totals;
      });
    } catch (error) {
      console.error('Error updating totals', error);
    }
  }

  async clear() {
    localStorage.removeItem(this.LOCAL_STORAGE_CART_ID);
    this.cartId = '';
  }
}

export default new CartStore();