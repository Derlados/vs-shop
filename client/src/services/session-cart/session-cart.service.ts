import { axiosInstance, headersJSON } from "..";
import { ICartProduct } from "../../types/ICartProduct";
import { Service } from "../service";

class SessionCartService extends Service {

    async getCart(cartId: string): Promise<ICartProduct[]> {
        const data = await this.execute(axiosInstance.get<ICartProduct[]>(`${this.API_URL}/${cartId}`, { headers: headersJSON() }));
        return data;
    }

    async createCart(): Promise<string> {
        const { data } = await axiosInstance.post<string>(`${this.API_URL}`, { headers: headersJSON() });
        return data;
    }

    async addProduct(cartId: string, productId: number, count: number) {
        const body = {
            productId: productId,
            count: count
        }

        const { data } = await axiosInstance.post(`${this.API_URL}/${cartId}/products`, body, { headers: headersJSON() });
        return data;
    }

    async editProduct(cartId: string, productId: number, count: number) {
        const body = {
            productId: productId,
            count: count
        }

        const { data } = await axiosInstance.put(`${this.API_URL}/${cartId}/products`, body, { headers: headersJSON() });
        return data;
    }

    async deleteProduct(cartId: string, productId: number) {
        const { data } = await axiosInstance.delete(`${this.API_URL}/${cartId}/products/${productId}`, { headers: headersJSON() });
        return data;
    }

    async clearCart(cartId: string) {
        const { data } = await axiosInstance.delete(`${this.API_URL}/${cartId}/clear`, { headers: headersJSON() });
        return data;
    }
}

export default new SessionCartService('/session-cart');