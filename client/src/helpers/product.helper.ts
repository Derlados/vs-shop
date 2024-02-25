import { IManufacturer } from "../types/magento/IManufacturer";
import { IProduct } from "../types/magento/IProduct";

class ProductHelper {

  getDescription(product: IProduct): string | undefined {
    return product.custom_attributes.find(attr => attr.attribute_code === "simple_description")?.value as string | undefined;
  }

  getSpecialPrice(product: IProduct): number | undefined {
    return product.custom_attributes.find(attr => attr.attribute_code === "special_price")?.value as number | undefined;
  }

  calculateDiscountPercent(product: IProduct): number {
    const price = product.price;
    const specialPrice = product.custom_attributes.find(attr => attr.attribute_code === "special_price")?.value as number;

    if (price && specialPrice) {
      return Math.round(((price - specialPrice) / price) * 100);
    }

    return 0;
  }

  isNew(product: IProduct): boolean {
    const from = product.custom_attributes.find(attr => attr.attribute_code === "news_from_date")?.value as string | undefined;
    const to = product.custom_attributes.find(attr => attr.attribute_code === "news_to_date")?.value as string | undefined;

    if (!from || !to) {
      return false;
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    const now = new Date();

    return now >= fromDate && now <= toDate;
  }

  getManufacturer(product: IProduct, manufacturers: IManufacturer[]): string | undefined {
    const manufacturerId = product.custom_attributes.find(attr => attr.attribute_code === "manufacturer")?.value as string | undefined;
    const manufacturer = manufacturers.find(manufacturer => manufacturer.value === manufacturerId);

    return manufacturer?.label;
  }
}

export default new ProductHelper();