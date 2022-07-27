import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

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

    @IsNumber()
    categoryId: number;

    @IsOptional()
    @IsBoolean()
    isBestSeller: boolean = false;
}