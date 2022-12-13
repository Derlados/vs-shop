import axios from "axios";
import userStore from "../store/user";

export const axiosNVInstance = axios.create({
    baseURL: 'https://api.novaposhta.ua/v2.0/json/'
})

export const axiosInstance = axios.create({
    //baseURL: 'http://localhost:5000/api'
    baseURL: 'https://vs-shop-test.herokuapp.com/api'
    // baseURL: 'https://vs-shop.herokuapp.com/api'
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