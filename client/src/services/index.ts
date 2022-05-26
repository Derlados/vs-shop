import axios from "axios";
import userStore from "../store/user";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',

});

export const headers = () => {
    return {
        Authorization: `Bearer ${userStore.token}`
    };
};

export const headersJSON = () => {
    return {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
    };
};