import { makeAutoObservable } from "mobx";
import shopService from "../../services/shop/shop.service";
import { IMail } from "../../types/IMail";
import { REGEX } from "../../values/regex";

enum ContactsStoreStatus {
    initial, loading, sentFailure, failure, success
}

class ContactsStore {
    public status: ContactsStoreStatus;
    public name: string;
    public email: string;
    public subject: string;
    public message: string;

    get isValid(): boolean {
        return this.name != '' && (REGEX.EMAIL_REGEX.test(this.email)) && this.subject != '' && this.message != '';
    }

    constructor() {
        makeAutoObservable(this);
        this.status = ContactsStoreStatus.initial;
    }

    init() {

    }

    onChangeName(name: string) {
        this.name = name;
    }

    onChangeEmail(email: string) {
        this.email = email;
    }

    onChangeSubject(subject: string) {
        this.subject = subject;
    }

    onChangeMessage(message: string) {
        this.message = message;
    }

    async sendMain(mail: IMail) {
        this.status = ContactsStoreStatus.loading;

        try {
            await shopService.sendMail(mail);

            this.status = ContactsStoreStatus.success;
        } catch (e) {
            this.status = ContactsStoreStatus.sentFailure;
        }
    }
}

export default new ContactsStore();