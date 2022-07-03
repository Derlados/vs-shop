import axios from "axios";
import { axiosInstance } from "..";
import { Service } from "../service";

class CategoryService extends Service {

    async login(email: string, password: string) {
        try {
            const body = {
                email: email,
                password: password
            }
            const { data } = await axiosInstance.post(`${this.API_URL}/login`, body);
            return data;
        } catch (e) {
            this.errorHandler(e);
        }
    }
}

export default new CategoryService('/auth');