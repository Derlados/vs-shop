import { IShippingInformation } from "../types/magento/IShippingInformation";

export class ShippingPattern {
  static readonly UA_SHIPPING: IShippingInformation = {
    addressInformation: {
      shippingAddress: {
        region: "",
        region_id: -1,
        country_id: "UA",
        street: [],
        company: "",
        telephone: "",
        postcode: "",
        city: "",
        firstname: "",
        lastname: "",
        email: "",
        prefix: "address_",
        region_code: "",
        sameAsBilling: 1
      },
      billingAddress: {
        region: "",
        region_id: -1,
        country_id: "UA",
        street: [],
        company: "",
        telephone: "",
        postcode: "",
        city: "",
        firstname: "",
        lastname: "",
        email: "",
        prefix: "address_",
        region_code: "",
      },
      shipping_method_code: "flatrate",
      shipping_carrier_code: "flatrate"
    }
  }
}