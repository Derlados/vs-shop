import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { KeyAttributeDto } from "./key-attribute.dto";

export class EditFiltersDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => KeyAttributeDto)
    newKeyAttributes: KeyAttributeDto[];

    @IsArray()
    @IsNumber({}, { each: true })
    deleteKeyAttributesIds: number[];
}
