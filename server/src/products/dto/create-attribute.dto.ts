import { Type } from "class-transformer";
import { IsString, ValidateNested } from "class-validator";
import { CreateValueDto } from "./create-value.dto";

export class CreateAttributeDto {
    @IsString()
    name: string;

    @ValidateNested()
    @Type(() => CreateValueDto)
    value: CreateValueDto;
}