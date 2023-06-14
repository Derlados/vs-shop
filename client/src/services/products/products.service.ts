import { axiosInstance, headersJSON } from "..";
import { SortType } from "../../enums/SortType.enum";
import filterUrlTransformer from "../../helpers/FilterUrlTransformer";
import { IImage } from "../../types/IImage";
import { IProduct } from "../../types/IProduct";
import { Service } from "../service";

export interface FilterOptions {
    search?: string | null;
    brands?: string[] | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    sort?: SortType | null;
    filter?: Map<number, number[]> | null;
}

class ProductService extends Service {

    async getAllProducts(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(this.API_URL, { headers: headersJSON() });
        return data;
    }

    async getProductsByCategory(categoryId: number, filters?: FilterOptions): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.API_URL}/category=${categoryId}`, {
            params: {
                ...filters,
                brands: filters?.brands && filters?.brands?.length != 0 ? filterUrlTransformer.transformArrayToUrl(filters.brands) : null,
                filter: filters?.filter ? filterUrlTransformer.transformAttrMapToUrl(filters?.filter) : null
            },
            headers: headersJSON()
        });
        return data;
    }

    async getProductsBySeller(sellerId: number): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.API_URL}/seller/${sellerId}`, { headers: headersJSON() });
        return data;
    }

    async getProductById(productId: number): Promise<IProduct> {
        const { data } = await axiosInstance.get<IProduct>(`${this.API_URL}/${productId}`, { headers: headersJSON() });
        return data;
    }

    async getBestsellers(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get(`${this.API_URL}/bestsellers`, { headers: headersJSON() });
        return data;
    }

    async getProductsByText(text: string): Promise<IProduct[]> {
        const params = {
            text: encodeURI(text)
        }

        const { data } = await axiosInstance.get(`${this.API_URL}/search`, { params: params, headers: headersJSON() });
        return data;
    }

    async getNewProducts(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get(`${this.API_URL}/new`, { headers: headersJSON() });
        return data;
    }

    async getProductCount(id: number): Promise<number> {
        const { data } = await axiosInstance.get(`${this.API_URL}/${id}/count`, { headers: headersJSON() });
        return data;
    }

    async addProducts(product: IProduct): Promise<IProduct> {
        const { data } = await axiosInstance.post<IProduct>(`${this.API_URL}`, this.getProductDto(product), { headers: headersJSON() });
        return data;
    }

    async editProduct(id: number, product: IProduct): Promise<IProduct> {
        const { data } = await axiosInstance.put<IProduct>(`${this.API_URL}/${id}`, this.getProductDto(product), { headers: headersJSON() });
        return data;
    }

    async editProductImages(id: number, images: File[], deletedImagesId?: number[], newMainImageId?: number): Promise<IImage[]> {
        const formData = new FormData();
        for (const image of images) {
            formData.append('images', image);
        }

        if (deletedImagesId) {
            for (const id of deletedImagesId) {
                formData.append('deletedImagesId[]', id.toString());
            }
        }
        if (newMainImageId) {
            formData.append('newMainImageId', newMainImageId.toString());
        }

        const { data } = await axiosInstance.put<IImage[]>(`${this.API_URL}/${id}/images`, formData, { headers: headersJSON() });
        return data;
    }

    async setBestsellerStatus(id: number) {
        const { data } = await axiosInstance.put(`${this.API_URL}/${id}/bestseller`, {}, { headers: headersJSON() });
        return data;
    }

    async deleteProduct(id: number) {
        const { data } = await axiosInstance.delete<IProduct>(`${this.API_URL}/${id}`, { headers: headersJSON() });
        return data;
    }

    async deleteBestsellerStatus(id: number) {
        const { data } = await axiosInstance.delete(`${this.API_URL}/${id}/bestseller`, { headers: headersJSON() });
        return data;
    }

    private getProductDto(p: IProduct) {
        const { id, images, discountPercent, userId, availability, ...product } = p;
        return product;
    }

}

export default new ProductService('/products');