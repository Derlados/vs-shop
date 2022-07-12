import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from ".";

export class Service {
    protected readonly API_URL: string;
    protected errorMessage: string;
    protected errorCode?: number;

    constructor(apiUrl: string) {
        this.API_URL = apiUrl;
        this.errorMessage = '';
    }

    protected async execute<T>(request: Promise<AxiosResponse<T, any>>): Promise<T> {
        this.errorMessage = '';
        this.errorCode = undefined;

        try {
            const { data } = await request;
            return data;
        } catch (e) {
            this.errorHandler(e);
            throw new Error()
        }
    }

    protected errorHandler(error: AxiosError | unknown) {
        if (error instanceof AxiosError && error.response?.status !== 500) {
            this.errorMessage = error.message;
            this.errorCode = error.response?.status;
        } else {
            this.errorMessage = 'Запит не може бути опрацьований, спробуйте пізніше';
        }
    }

    public getError() {
        return this.errorMessage;
    }

    public getErrorCode() {
        return this.errorCode;
    }
}