import { Type } from "class-transformer";
import { IsArray, IsEmail, isEmail, IsNumber, IsOptional, IsPhoneNumber, IsString, Max, MaxLength, ValidateNested } from "class-validator";
import { OrderProductDto } from "./order-product.dto";

export class CreateOrderDto {
    @IsString()
    @MaxLength(100)
    client: string;

    @IsPhoneNumber()
    @MaxLength(20)
    phone: string;

    @IsEmail()
    @MaxLength(50)
    email: string;

    @IsString()
    @MaxLength(200)
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