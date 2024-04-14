import { AxiosError } from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import cartService from "../../services/cart/cart.service";
import { IWarehouse } from "../../types/novaposhta/IWarehouse";
import { ICart } from "../../types/magento/ICart";
import { IShippingInformation } from "../../types/magento/IShippingInformation";
import { ITotals } from "../../types/magento/ITotals";
import { REGEX } from "../../values/regex";
import { ShippingPattern } from "../../values/shipping-patterns";
import { ISettlement } from "../../types/novaposhta/ISettlement";

class CartStore {
  private readonly LOCAL_STORAGE_CART_ID = "cartId";

  private cartId: string;
  public status: 'initial' | 'loading' | 'success' | 'error' | 'placing' | 'placing-success';
  public cart: ICart;
  public totals?: ITotals;
  public isInit: boolean;
  public processingSku: string;
  public shippingInformation: IShippingInformation;

  constructor() {
    makeAutoObservable(this);

    this.cartId = localStorage.getItem(this.LOCAL_STORAGE_CART_ID) || '';
    this.status = 'initial';
    this.isInit = false;
    this.processingSku = '';

    this.shippingInformation = { ...ShippingPattern.UA_SHIPPING };
  }

  get isValidCheckout() {
    const { city, street, telephone, firstname, lastname, email, postcode } = this.shippingInformation.addressInformation.shippingAddress;

    const isValidShipping = this.shippingInformation.addressInformation.shippingAddress.region
      && city
      && street.length > 0
      && telephone && REGEX.PHONE_REGEX.test(telephone)
      && firstname
      && lastname
      && email && REGEX.EMAIL_REGEX.test(email)
      && postcode;

    return this.cart && this.cart.items.length > 0 && isValidShipping;
  }

  get validErrors() {
    const { city, street, telephone, firstname, lastname, email, postcode } = this.shippingInformation.addressInformation.shippingAddress;
    const errors = {
      "city": !city ? "Оберіть населений пункт" : "",
      "street": street.length === 0 ? "Оберіть точку видачі" : "",
      "telephone": !telephone || !REGEX.PHONE_REGEX.test(telephone) ? "Введіть коректний номер телефону" : "",
      "firstname": !firstname ? "Введіть ім'я" : "",
      "lastname": !lastname ? "Введіть прізвище" : "",
      "email": email && !REGEX.EMAIL_REGEX.test(email) ? "Введіть коректну електронну пошту" : "",
    };

    return errors;
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
    } catch (error: AxiosError | unknown) {
      if ((error as AxiosError).response?.status === 404 && this.cartId) {
        await this.clear();
        await this.init();
        return;
      }

      runInAction(() => this.status = 'error');
    }
  }

  async addProduct(sku: string, quantity: number) {
    runInAction(() => {
      this.status = 'loading';
      this.processingSku = sku;
    });

    try {
      const res = await cartService.addItem(this.cartId, sku, quantity);
      await this.updateTotals();
      const updatedItems = [...this.cart.items, res];

      runInAction(() => {
        this.cart.items = updatedItems;
        this.processingSku = '';
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  async updateProduct(itemId: number, quantity: number) {
    runInAction(() => {
      this.status = 'loading';
      this.processingSku = this.cart.items.find(item => item.item_id === itemId)?.sku || '';
    });

    try {
      const res = await cartService.updateItem(this.cartId, itemId, quantity);
      await this.updateTotals();
      const updatedItems = this.cart.items.map(item => item.item_id === res.item_id ? res : item);

      runInAction(() => {
        this.cart.items = updatedItems;
        this.processingSku = '';
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  async removeProduct(itemId: number) {
    runInAction(() => {
      this.status = 'loading';
      this.processingSku = this.cart.items.find(item => item.item_id === itemId)?.sku || '';
    });

    try {
      await cartService.deleteItem(this.cartId, itemId);
      await this.updateTotals();

      runInAction(() => {
        this.cart.items = this.cart.items.filter(item => item.item_id !== itemId);
        this.processingSku = '';
        this.status = 'success';
      });
    } catch (error) {
      runInAction(() => this.status = 'error');
    }
  }

  async placeOrder() {
    runInAction(() => this.status = 'placing');

    try {
      await cartService.setShippingInformation(this.cartId, this.shippingInformation);
      await cartService.placeOrder(this.cartId, 'checkmo');

      this.clear();
      this.init();

      runInAction(() => this.status = 'placing-success');
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

  clear() {
    localStorage.removeItem(this.LOCAL_STORAGE_CART_ID);
    this.cartId = '';
  }

  updateShippingInformation(key: keyof IShippingInformation["addressInformation"]["shippingAddress"], value: string | string[]) {
    this.shippingInformation = {
      ...this.shippingInformation,
      addressInformation: {
        ...this.shippingInformation.addressInformation,
        shippingAddress: {
          ...this.shippingInformation.addressInformation.shippingAddress,
          [key]: value
        },
        billingAddress: {
          ...this.shippingInformation.addressInformation.billingAddress,
          [key]: value
        }
      }
    };
  }

  setSettlement(settlement: ISettlement, warehouse: IWarehouse) {
    this.updateShippingInformation("region", warehouse.region);
    this.updateShippingInformation("city", `${settlement.name}, ${settlement.area}`);
    this.updateShippingInformation("street", [warehouse.address]);
    this.updateShippingInformation("postcode", warehouse.postcode || '');
  }

  clearSettlement() {
    this.updateShippingInformation("region", '');
    this.updateShippingInformation("city", '');
    this.updateShippingInformation("street", []);
    this.updateShippingInformation("postcode", '');
  }

  getAddressInfoByKey<T>(key: keyof IShippingInformation["addressInformation"]["shippingAddress"]): T {
    return this.shippingInformation.addressInformation.shippingAddress[key] as T;
  }
}

export default new CartStore();