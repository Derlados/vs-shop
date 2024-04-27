import { IProductAttribute } from "./IProductAttribute";
import { IProductLink } from "./IProductLink";

export interface IProduct {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  extension_attributes: {
    website_ids: number[];
    category_links: {
      position: number;
      category_id: string;
    }[];
    stock_status: StockStatus;
    description_attributes: IProductAttribute[];
  };
  product_links: IProductLink[];
  options: any[];
  media_gallery_entries: {
    id: number;
    media_type: string;
    label: string | null;
    position: number;
    disabled: boolean;
    types: string[];
    file: string;
  }[];
  tier_prices: any[];
  custom_attributes: {
    attribute_code:
    "image" |
    "small_image" |
    "thumbnail" |
    "swatch_image" |
    "page_layout" |
    "options_container" |
    "url_key" |
    "msrp_display_actual_price_type" |
    "gift_message_available" |
    "required_options" |
    "has_options" |
    "meta_title" |
    "meta_keyword" |
    "meta_description" |
    "tax_class_id" |
    "category_ids" |
    "simple_description" |
    "special_price" |
    "news_from_date" |
    "news_to_date" |
    "manufacturer";
    value: string | number | string[];
  }[];
}

export enum StockStatus {
  OUT_OF_STOCK = 0,
  IN_STOCK = 1,
  RUNNING_LOW = 2
}
