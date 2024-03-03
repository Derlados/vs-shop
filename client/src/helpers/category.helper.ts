import { ICategory } from "../types/magento/ICategory";

class CategorygHelper {
  getImage(category: ICategory): string | undefined {
    return category.custom_attributes.find(attribute => attribute.attribute_code === "image")?.value as string;
  }

  getUrlPath(category: ICategory): string | undefined {
    return category.custom_attributes.find(attribute => attribute.attribute_code === "url_path")?.value as string;
  }
}

export default new CategorygHelper();