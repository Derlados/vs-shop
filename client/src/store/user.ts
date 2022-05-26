import { makeAutoObservable } from "mobx";

class UserStore {
    token: string;

    constructor() {
        makeAutoObservable(this);
        this.token = localStorage.getItem('access-token') ?? '';
    }
}

export default new UserStore();