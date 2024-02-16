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
  };
  product_links: any[];
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
    attribute_code: "image" | "small_image" | "thumbnail" | "swatch_image" | "page_layout" | "options_container" | "url_key" | "msrp_display_actual_price_type" | "gift_message_available" | "required_options" | "has_options" | "meta_title" | "meta_keyword" | "meta_description" | "tax_class_id" | "category_ids" | string;
    value: string | number | string[];
  }[];
}