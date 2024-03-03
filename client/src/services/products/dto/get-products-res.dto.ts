import { IProduct } from "../../../types/magento/IProduct";

export interface IGetProductsResDto {
  items: IProduct[];
  search_criteria: any;
  total_count: number;
}