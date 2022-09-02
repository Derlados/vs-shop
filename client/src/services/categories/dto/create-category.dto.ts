import { KeyAttributeDto } from "./key-attribute.dto";

export interface CreateCategoryDto {
    catalogId: number;
    name: string;
    routeName: string;
    isNew: boolean;
    attributes: KeyAttributeDto[];
}