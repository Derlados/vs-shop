import { axiosInstance, headersJSON } from ".";
import { IProduct } from "../types/IProduct";
import { Service } from "./service";

class PrdouctService extends Service {

    async getAllProducts(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(this.API_URL, { headers: headersJSON() });
        return this.parseProducts(data);
    }

    async getPrdouctsBycategory(categoryId: number): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.API_URL}/category=${categoryId}`, { headers: headersJSON() });
        return this.parseProducts(data);
    }

    async getProductsBySeller(sellerId: number): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.API_URL}/seller/${sellerId}`, { headers: headersJSON() });
        return this.parseProducts(data);
    }

    private parseProducts(products: IProduct[]) {
        products.forEach(p => {
            p.attributes = new Map(Object.entries(p.attributes));
        })

        return products;
    }
}

export default new PrdouctService('/products');