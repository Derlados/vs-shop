import { axiosInstance, headersAuthJson } from "..";
import { SortType } from "../../enums/SortType.enum";
import filterUrlTransformer from "../../helpers/FilterUrlTransformer";
import { IProduct } from "../../types/IProduct";
import { Service } from "../service";

export interface FilterOptions {
    search?: string | null;
    page?: number | null;
    brands?: string[] | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sort?: SortType | null;
    filter?: Map<number, number[]> | null;
}

class ProductService extends Service {

    async getAllProducts(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(this.apiUrl, { headers: headersAuthJson() });
        return data;
    }

    async getProductsByCategory(categoryId: number, filters?: FilterOptions): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.apiUrl}/category=${categoryId}`, {
            params: {
                page: filters?.page ? filters.page - 1 : null,
                search: filters?.search ? encodeURI(filters.search) : null,
                minPrice: filters?.minPrice ? filters.minPrice : null,
                maxPrice: filters?.maxPrice ? filters.maxPrice : null,
                brands: filters?.brands && filters?.brands?.length != 0 ? filterUrlTransformer.transformArrayToUrl(filters.brands) : null,
                filter: filters?.filter ? filterUrlTransformer.transformAttrMapToUrl(filters?.filter) : null
            },
            headers: headersAuthJson()
        });
        return data;
    }

    async getProductsBySeller(sellerId: number): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.apiUrl}/seller/${sellerId}`, { headers: headersAuthJson() });
        return data;
    }

    async getProductById(productId: number): Promise<IProduct> {
        const { data } = await axiosInstance.get<IProduct>(`${this.apiUrl}/${productId}`, { headers: headersAuthJson() });
        return data;
    }

    async getBestsellers(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get(`${this.apiUrl}/bestsellers`, { headers: headersAuthJson() });
        return data;
    }

    async getProductsByText(text: string): Promise<IProduct[]> {
        const params = {
            text: encodeURI(text)
        }

        const { data } = await axiosInstance.get(`${this.apiUrl}/search`, { params: params, headers: headersAuthJson() });
        return data;
    }

    async getNewProducts(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get(`${this.apiUrl}/new`, { headers: headersAuthJson() });
        return data;
    }

    async getProductCount(id: number): Promise<number> {
        const { data } = await axiosInstance.get(`${this.apiUrl}/${id}/count`, { headers: headersAuthJson() });
        return data;
    }
}

export default new ProductService('/products');