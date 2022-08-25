import { IsOptional, IsString } from "class-validator";

export class SearchProductsQuery {
    @IsString()
    @IsOptional()
    text: string;
}