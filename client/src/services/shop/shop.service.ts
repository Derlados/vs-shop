import axios from "axios";
import { axiosInstance, headersAuth, headersAuthJson } from "..";
import { IBanner } from "../../types/ILargeBanner";
import { ShopInfo } from "../../types/ShopInfo";
import { Service } from "../service";
import { serialize } from 'object-to-formdata';
import { IContact } from "../../types/IContact";
import { IMail } from "../../types/IMail";

class ShopService extends Service {

    async getShopInfo(): Promise<ShopInfo> {
        const { data } = await axiosInstance.get(`${this.apiUrl}/all-info`);
        return data;
    }

    async sendMail(mail: IMail) {
        await this.execute(axiosInstance.post(`${this.apiUrl}/email`, mail));
    }

    async addBanner(banner: IBanner, img: File): Promise<IBanner> {
        const { id, img: image, ...bannerData } = banner;

        const formData = serialize(bannerData);
        formData.append('image', img);

        const { data } = await axiosInstance.post(`${this.apiUrl}/banner`, formData, { headers: headersAuth() });
        return data;
    }

    async editBanner(updatedBanner: IBanner, img?: File): Promise<IBanner> {
        const { id, img: image, ...bannerData } = updatedBanner;

        const formData = serialize(bannerData);
        if (img) {
            formData.append('image', img);
        }

        const { data } = await axiosInstance.put(`${this.apiUrl}/banner/${id}`, formData, { headers: headersAuth() });
        return data;
    }

    async deleteBanner(id: number) {
        const { data } = await axiosInstance.delete(`${this.apiUrl}/banner/${id}`, { headers: headersAuth() });
        return data;
    }

    async editSmallBanner(img: File) {
        const formData = new FormData();
        formData.append('image', img);

        const { data } = await axiosInstance.put(`${this.apiUrl}/small-banner`, formData, { headers: headersAuth() });
        return data;

    }

    async editContacts(contacts: IContact[]) {
        const body = {
            contacts: contacts
        }

        const { data } = await axiosInstance.put(`${this.apiUrl}/contacts`, body, { headers: headersAuthJson() });
        return data;
    }

}

export default new ShopService('/shop');