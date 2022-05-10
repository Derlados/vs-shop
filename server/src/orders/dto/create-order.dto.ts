import { Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString, Max, ValidateNested } from "class-validator";
import { OrderProductDto } from "./order-product.dto";

export class CreateOrderDto {
    @IsString()
    @Max(100)
    client: string;

    @IsString()
    @Max(20)
    phone: string;

    @IsString()
    @Max(50)
    email: string;

    @IsString()
    @Max(200)
    address: string;

    @IsOptional()
    @IsString()
    additionalInfo: string;

    @IsNumber()
    totalPrice: number;

    @IsArray()
    @ValidateNested()
    @Type(() => OrderProductDto)
    orderProducts: OrderProductDto[];
}