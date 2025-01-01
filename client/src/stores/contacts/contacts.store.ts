import { makeAutoObservable, runInAction } from "mobx";
import { IMail } from "../../types/shop/IMail";
import { REGEX } from "../../values/regex";

export enum ContactsStoreStatus {
  initial, sending, sentFailure, failure, success
}

class ContactsStore {
  public status: ContactsStoreStatus;
  public contactInfo: IMail;

  public isTriedToSend: boolean;

  get isValid(): boolean {
    return (
      this.contactInfo.name !== '' &&
      REGEX.EMAIL.test(this.contactInfo.email) &&
      this.contactInfo.subject !== '' &&
      this.contactInfo.message !== ''
    );
  }

  constructor() {
    makeAutoObservable(this);
    this.status = ContactsStoreStatus.initial;
    this.contactInfo = {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: ''
    }
    this.isTriedToSend = false;
  }

  onChangeContactInfo(field: keyof IMail, value: string) {
    this.contactInfo[field] = value;
    this.isTriedToSend = false;
  }

  async sendMail() {
    runInAction(() => this.isTriedToSend = true);
    if (!this.isValid || this.status === ContactsStoreStatus.sending || this.status === ContactsStoreStatus.success) {
      return;
    }

    runInAction(() => this.status = ContactsStoreStatus.sending);

    try {
      // await shopService.sendMail(mail);

      runInAction(() => this.status = ContactsStoreStatus.success);
    } catch (e) {
      runInAction(() => this.status = ContactsStoreStatus.sentFailure);
    }
  }
}

export default new ContactsStore();