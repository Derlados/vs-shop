import { makeAutoObservable } from "mobx";
import { IUser, UserRoles } from "../types/IUser";

class UserStore {
    private readonly ACCESS_TOKEN = 'access-token';
    user?: IUser;
    token: string;

    constructor() {
        makeAutoObservable(this);
        this.token = localStorage.getItem(this.ACCESS_TOKEN) ?? '';
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem(this.ACCESS_TOKEN, token)
    }

    setUserInfo(user: IUser) {
        this.user = user;
    }

    deleteToken() {
        this.token = '';
        localStorage.removeItem(this.ACCESS_TOKEN);
    }

    isAuth() {
        return this.token !== '';
    }
}

export default new UserStore();