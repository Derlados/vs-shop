import { Type } from "class-transformer";
import { IsArray, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";

export class FilterProductsQuery {
    @IsOptional()
    @IsNumberString()
    limit?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    brands?: string[];

    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    maxPrice?: number;
}

