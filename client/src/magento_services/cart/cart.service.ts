import { axiosInstance, headersAuthJson, headersJson } from "../../services";
import { Service } from "../../services/service";
import { ICart } from "../../types/magento/ICart";
import { ITotals } from "../../types/magento/ITotals";
import { IUpdateItemRes } from "./dto/update-item-res.dto";

class CartService extends Service {

  async createCartId(): Promise<string> {
    return await this.execute(axiosInstance.get<string>(this.apiUrl));
  }

  async getCart(cartId: string): Promise<ICart> {
    return await this.execute(axiosInstance.get<ICart>(`${this.apiUrl}/${cartId}`));
  }

  async getTotals(cartId: string): Promise<ITotals> {
    return await this.execute(axiosInstance.get(`${this.apiUrl}/${cartId}/totals`));
  }

  async addItem(cartId: string, sku: string, qty: number): Promise<IUpdateItemRes> {
    const body = {
      cartItem: { sku, qty }
    }
    return await this.execute(axiosInstance.post(`${this.apiUrl}/${cartId}/items`, body, { headers: headersJson }));
  }

  async updateItem(cartId: string, itemId: number, qty: number): Promise<IUpdateItemRes> {
    const body = {
      cartItem: { qty }
    }
    return await this.execute(axiosInstance.put(`${this.apiUrl}/${cartId}/items/${itemId}`, body, { headers: headersJson }));
  }

  async deleteItem(cartId: string, itemId: number): Promise<boolean> {
    return await this.execute(axiosInstance.delete(`${this.apiUrl}/${cartId}/items/${itemId}`));
  }
}

export default new CartService('/guest-carts');