import { IsArray, IsNumber, IsOptional } from "class-validator";

export class EditSelectedOrdersDto {

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    toDeleteIds?: number[];
}