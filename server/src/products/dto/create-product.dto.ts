import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { ProductAttribute } from "../models/product.model";
import { CreateAttributeDto } from "./create-attribute.dto";

export class CreateProductDto {
    @IsString()
    title: string;

    @IsString()
    brand: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    oldPrice: number;

    @IsBoolean()
    isNew: boolean;

    @IsNumber()
    count: number;

    @IsNumber()
    maxByOrder: number;

    @IsNumber()
    categoryId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateAttributeDto)
    attributes: CreateAttributeDto[];

    @IsOptional()
    @IsString()
    parserUrl?: string;

    @IsOptional()
    @IsString()
    image?: string;
}