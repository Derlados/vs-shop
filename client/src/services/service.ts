import { AxiosError, AxiosRequestConfig } from "axios";
import { axiosInstance } from ".";

export class Service {
    protected readonly API_URL: string;

    constructor(apiUrl: string) {
        this.API_URL = apiUrl;
    }

    errorHandler(error: AxiosError | unknown) {
        if (error instanceof AxiosError) {

        } else {

        }
    }


}