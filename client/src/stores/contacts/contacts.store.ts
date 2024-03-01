import { makeAutoObservable, runInAction } from "mobx";
import { IMail } from "../../types/IMail";
import { REGEX } from "../../values/regex";

export enum ContactsStoreStatus {
    initial, sending, sentFailure, failure, success
}

class ContactsStore {
    public status: ContactsStoreStatus;
    public name: string;
    public email: string;
    public subject: string;
    public message: string;

    public isTriedToSend: boolean;

    get isValid(): boolean {
        return this.name !== '' && REGEX.EMAIL_REGEX.test(this.email) && this.email !== '' && this.subject !== '' && this.message !== '';
    }

    constructor() {
        makeAutoObservable(this);
        this.status = ContactsStoreStatus.initial;
        this.name = '';
        this.email = '';
        this.subject = '';
        this.message = '';
        this.isTriedToSend = false;
    }

    onNameChange(name: string) {
        this.name = name;
        this.isTriedToSend = false;
    }

    onEmailChange(email: string) {
        this.email = email;
        this.isTriedToSend = false;
    }

    onSubjectChange(subject: string) {
        this.subject = subject;
        this.isTriedToSend = false;
    }

    onMessageChange(message: string) {
        this.message = message;
        this.isTriedToSend = false;
    }

    async sendMail() {
        runInAction(() => this.isTriedToSend = true);
        if (!this.isValid || this.status == ContactsStoreStatus.sending || this.status == ContactsStoreStatus.success) {
            return;
        }

        runInAction(() => this.status = ContactsStoreStatus.sending);

        const mail: IMail = {
            name: this.name,
            email: this.email,
            subject: this.subject,
            message: this.message
        };

        try {
            // await shopService.sendMail(mail);

            runInAction(() => this.status = ContactsStoreStatus.success);
        } catch (e) {
            runInAction(() => this.status = ContactsStoreStatus.sentFailure);
        }
    }
}

export default new ContactsStore();