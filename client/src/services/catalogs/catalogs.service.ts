import { axiosInstance, headersAuthJson } from "..";
import { ICatalog } from "../../types/ICatalog";
import { Service } from "../service";

class CatalogService extends Service {

    async getAll(): Promise<ICatalog[]> {
        const { data } = await axiosInstance.get<ICatalog[]>(this.apiUrl, { headers: headersAuthJson() })
        return data;
    }
}

export default new CatalogService('/catalogs');