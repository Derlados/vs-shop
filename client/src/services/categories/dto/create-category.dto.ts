import { KeyAttributeDto } from "./key-attribute.dto";

export interface CreateCategoryDto {
    name: string;
    routeName: string;
    attributes: KeyAttributeDto[];
}