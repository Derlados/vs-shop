export interface ICategory {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  children: string;
  created_at: string;
  updated_at: string;
  path: string;
  include_in_menu: boolean;
  custom_attributes: {
    attribute_code: "is_anchor" | "path" | "children_count" | "url_key" | "url_path";
    value: string | number;
  }[];
}