import { axiosInstance, headersAuthJson } from "..";
import { ICartProduct } from "../../types/ICartProduct";
import { Service } from "../service";

class CartService extends Service {

    async getCart(cartId: string): Promise<ICartProduct[]> {
        const data = await this.execute(axiosInstance.get<ICartProduct[]>(`${this.apiUrl}/${cartId}`, { headers: headersAuthJson() }));
        return data;
    }

    async createCart(): Promise<string> {
        const { data } = await axiosInstance.post<string>(`${this.apiUrl}`, { headers: headersAuthJson() });
        return data;
    }

    async addProduct(cartId: string, productId: number, count: number) {
        const body = {
            productId: productId,
            count: count
        }

        const { data } = await axiosInstance.post(`${this.apiUrl}/${cartId}/products`, body, { headers: headersAuthJson() });
        return data;
    }

    async editProduct(cartId: string, productId: number, count: number) {
        const body = {
            productId: productId,
            count: count
        }

        const { data } = await axiosInstance.put(`${this.apiUrl}/${cartId}/products`, body, { headers: headersAuthJson() });
        return data;
    }

    async deleteProduct(cartId: string, productId: number) {
        const { data } = await axiosInstance.delete(`${this.apiUrl}/${cartId}/products/${productId}`, { headers: headersAuthJson() });
        return data;
    }

    async clearCart(cartId: string) {
        const { data } = await axiosInstance.delete(`${this.apiUrl}/${cartId}/clear`, { headers: headersAuthJson() });
        return data;
    }
}

export default new CartService('/session-cart');