import { Type } from "class-transformer";
import { isArray, IsBoolean, isBoolean, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { CreateProductDto } from "./create-product.dto";

export class ReqCreateProductDto {
    @ValidateNested()
    @Type(() => CreateProductDto)
    product: CreateProductDto;

    @IsObject()
    @Type(() => Map)
    attributes: Map<string, string>;
}