import { IsOptional, IsString } from "class-validator";

export class GetProductsQuery {
    @IsString()
    @IsOptional()
    text: string;
}