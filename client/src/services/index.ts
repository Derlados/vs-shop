import axios from "axios";
// import userStore from "../store/user/user";

export const axiosNVInstance = axios.create({
    baseURL: 'https://api.novaposhta.ua/v2.0/json/'
})

export const axiosInstance = axios.create({
    baseURL: 'http://guessdraw.fun/rest/V1'
});

export const headersJson = {
    'Content-Type': 'application/json'
};

export const headersAuthJson = () => {
    return {
        // Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json'
    };
};