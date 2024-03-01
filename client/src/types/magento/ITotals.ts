import ICartItem from "./ICartItem";

export interface ITotals {
  grand_total: number;
  base_grand_total: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount: number;
  base_discount_amount: number;
  subtotal_with_discount: number;
  base_subtotal_with_discount: number;
  shipping_amount: number;
  base_shipping_amount: number;
  shipping_discount_amount: number;
  base_shipping_discount_amount: number;
  tax_amount: number;
  base_tax_amount: number;
  weee_tax_applied_amount: number | null;
  shipping_tax_amount: number;
  base_shipping_tax_amount: number;
  subtotal_incl_tax: number;
  shipping_incl_tax: number;
  base_shipping_incl_tax: number;
  base_currency_code: string;
  quote_currency_code: string;
  items_qty: number;
  items: ICartItem[];
  total_segments: {
    code: 'subtotal' | 'shipping' | 'tax' | 'grand_total';
    title: string;
    value: number;
    extension_attributes?: {
      tax_grandtotal_details: any[];
    };
    area?: string;
  }[];
}