import { axiosInstance, headersJSON } from "..";
import { IImage } from "../../types/IImage";
import { IProduct } from "../../types/IProduct";
import { Service } from "../service";

class ProductService extends Service {

    async getAllProducts(): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(this.API_URL, { headers: headersJSON() });
        return this.parseProducts(data);
    }

    async getProductsByCategory(categoryId: number): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.API_URL}/category=${categoryId}`, { headers: headersJSON() });
        return this.parseProducts(data);
    }

    async getProductsBySeller(sellerId: number): Promise<IProduct[]> {
        const { data } = await axiosInstance.get<IProduct[]>(`${this.API_URL}/seller/${sellerId}`, { headers: headersJSON() });
        return this.parseProducts(data);
    }

    async addProducts(product: IProduct): Promise<IProduct> {
        const { data } = await axiosInstance.post<IProduct>(`${this.API_URL}`, this.getProductDto(product), { headers: headersJSON() });
        return this.parseProduct(data);
    }

    async editProduct(id: number, product: IProduct): Promise<IProduct> {
        const { data } = await axiosInstance.put<IProduct>(`${this.API_URL}/${id}`, this.getProductDto(product), { headers: headersJSON() });
        return this.parseProduct(data);
    }

    async editProductImages(id: number, images: File[], deletedImagesId?: number[], newMainImageId?: number): Promise<IImage[]> {
        const formData = new FormData();
        for (const image of images) {
            formData.append('images', image);
        }
        console.log(formData.getAll('images'));

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

    async deleteProduct(id: number) {
        const { data } = await axiosInstance.delete<IProduct>(`${this.API_URL}/${id}`, { headers: headersJSON() });
        return data;
    }

    private getProductDto(product: IProduct) {
        return {
            product: {
                title: product.title,
                description: product.description,
                price: product.price,
                oldPrice: product.oldPrice,
                isNew: product.isNew,
                count: product.count,
                categoryId: product.categoryId
            },
            attributes: Object.fromEntries(product.attributes)
        }
    }

    private parseProducts(products: IProduct[]) {
        products.forEach(p => this.parseProduct(p))
        return products;
    }

    private parseProduct(product: IProduct) {
        product.attributes = new Map(Object.entries(product.attributes));
        return product;
    }
}

export default new ProductService('/products');