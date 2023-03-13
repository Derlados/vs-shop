import { Transform, Type } from "class-transformer";
import { IsArray, IsNumber, IsNumberString, IsOptional, IsString, Matches, ValidateNested } from "class-validator";

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
    @Type(() => Number)
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxPrice?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => value.split(','))
    @Matches(/(\d+-\d+)/, { each: true })
    filters?: string[];
}

