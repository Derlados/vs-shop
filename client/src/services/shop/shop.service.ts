import axios from "axios";
import { axiosInstance, headers, headersJSON } from "..";
import { IBanner } from "../../types/ILargeBanner";
import { ShopInfo } from "../../types/ShopInfo";
import { Service } from "../service";
import { serialize } from 'object-to-formdata';
import { IContact } from "../../types/IContact";

class ShopService extends Service {

    async getShopInfo(): Promise<ShopInfo> {
        const { data } = await axiosInstance.get(this.API_URL);
        return data;
    }

    async addBanner(banner: IBanner, img: File): Promise<IBanner> {
        const { id, img: image, ...bannerData } = banner;

        const formData = serialize(bannerData);
        formData.append('image', img);

        const { data } = await axiosInstance.post(`${this.API_URL}/banner`, formData, { headers: headers() });
        return data;
    }

    async editBanner(updatedBanner: IBanner, img?: File): Promise<IBanner> {
        const { id, img: image, ...bannerData } = updatedBanner;

        const formData = serialize(bannerData);
        if (img) {
            formData.append('image', img);
        }

        const { data } = await axiosInstance.put(`${this.API_URL}/banner/${id}`, formData, { headers: headers() });
        return data;
    }

    async deleteBanner(id: number) {
        const { data } = await axiosInstance.delete(`${this.API_URL}/banner/${id}`, { headers: headers() });
        return data;
    }

    async editSmallBanner(img: File) {
        const formData = new FormData();
        formData.append('image', img);

        const { data } = await axiosInstance.put(`${this.API_URL}/small-banner`, formData, { headers: headers() });
        return data;

    }

    async editContacts(contacts: IContact[]) {
        const body = {
            contacts: contacts
        }

        const { data } = await axiosInstance.put(`${this.API_URL}/contacts`, body, { headers: headersJSON() });
        return data;
    }

}

export default new ShopService('/shop-info');