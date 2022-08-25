import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsString, ValidateNested } from "class-validator";
import { KeyAttributeDto } from "./key-attribute.dto";

export class CreateCategoryDto {
    @IsString()
    name: string;

    @IsString()
    routeName: string;

    @IsBoolean()
    isNew: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => KeyAttributeDto)
    attributes: KeyAttributeDto[];
}