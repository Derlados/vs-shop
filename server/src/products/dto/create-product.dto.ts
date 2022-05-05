import { Type } from "class-transformer";
import { isArray, IsBoolean, isBoolean, IsNumber, IsObject, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    title: string;

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

}