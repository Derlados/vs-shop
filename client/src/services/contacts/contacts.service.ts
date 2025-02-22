import { axiosInstance, headersJson } from "..";
import { ApiService } from "../service";
import { CreateContactEmailDto } from "./dto/create-contact-email.dto";

class ContactsService extends ApiService {
  async sendContactForm(data: CreateContactEmailDto): Promise<any> {
    return await this.execute(axiosInstance.post(this.apiUrl, data, { headers: headersJson }));
  }
}

export default new ContactsService('/vs-shop/contact-us');