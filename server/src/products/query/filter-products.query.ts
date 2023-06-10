import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsIn, IsNumber, IsNumberString, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { SortType } from "src/constants/SortType";
import { transformFilters } from "../transformers/filter.transformer";

export class FilterProductsQuery {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumberString()
    limit?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => value.split(','))
    brands?: string[];

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxPrice?: number;

    @IsOptional()
    @Transform(({ value }) => transformFilters(value.split(',')))
    @Type(() => Map)
    filter?: Map<number, number[]>;

    @IsOptional()
    @IsEnum(SortType)
    sort?: SortType;
}



