import { axiosInstance, headersJSON } from "..";
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
        const { data } = await axiosInstance.post<IProduct>(`${this.API_URL}/products`, this.getProductDto(product), { headers: headersJSON() });
        return this.parseProduct(data);
    }

    async editProduct(id: number, product: IProduct) {
        const { data } = await axiosInstance.put<IProduct>(`${this.API_URL}/products/${id}`, this.getProductDto(product), { headers: headersJSON() });
        return this.parseProduct(data);
    }

    async editProductImages() {

    }

    async deleteProduct(id: number) {
        const { data } = await axiosInstance.delete<IProduct>(`${this.API_URL}/products/${id}`, { headers: headersJSON() });
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
            attributes: product.attributes
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