import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

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
}