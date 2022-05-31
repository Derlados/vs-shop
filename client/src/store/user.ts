import { makeAutoObservable } from "mobx";
import { IUser, UserRoles } from "../types/IUser";

class UserStore {
    private readonly ACCESS_TOKEN = 'access-token';
    private readonly USER_INFO = 'user-info';
    userInfo?: IUser;
    token: string;

    constructor() {
        makeAutoObservable(this);
        this.token = localStorage.getItem(this.ACCESS_TOKEN) ?? '';

        const jsonInfo = localStorage.getItem(this.USER_INFO);
        this.userInfo = jsonInfo !== null ? JSON.parse(jsonInfo) : null;
    }

    get isAuth(): boolean {
        return this.token !== '' && this.userInfo !== null;
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem(this.ACCESS_TOKEN, token)
    }

    setUserInfo(user: IUser) {
        this.userInfo = user;
        localStorage.setItem(this.USER_INFO, JSON.stringify(user))
    }

    deleteToken() {
        this.token = '';
        localStorage.removeItem(this.ACCESS_TOKEN);
    }


}

export default new UserStore();