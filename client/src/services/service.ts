import { AxiosError, AxiosRequestConfig } from "axios";
import { axiosInstance } from ".";

export class Service {
    protected readonly API_URL: string;
    protected errorMessage: string;

    constructor(apiUrl: string) {
        this.API_URL = apiUrl;
        this.errorMessage = '';
    }

    protected errorHandler(error: AxiosError | unknown) {
        if (error instanceof AxiosError) {
            this.errorMessage = error.message;
        } else {

        }
    }

    public getError() {
        return this.errorMessage;
    }
}