import { axiosInstance, headersJSON } from "..";
import { ICatalog } from "../../types/ICatalog";
import { Service } from "../service";

class CatalogService extends Service {

    async getAll(): Promise<ICatalog[]> {
        const { data } = await axiosInstance.get<ICatalog[]>(this.API_URL, { headers: headersJSON() })
        return data;
    }

    async createCatalog(name: string): Promise<ICatalog> {
        const body = { name: name };
        const { data } = await axiosInstance.post<ICatalog>(this.API_URL, body, { headers: headersJSON() })
        return data;
    }

    async editCatalog(id: number, name: string): Promise<ICatalog> {
        const body = { name: name };
        const { data } = await axiosInstance.put<ICatalog>(`${this.API_URL}/${id}`, body, { headers: headersJSON() })
        return data;
    }

    async deleteCatalog(id: number) {
        const { data } = await axiosInstance.delete<void>(`${this.API_URL}/${id}`, { headers: headersJSON() })
        return data;
    }
}

export default new CatalogService('/catalogs');