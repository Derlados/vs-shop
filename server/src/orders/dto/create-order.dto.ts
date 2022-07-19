import { Type } from "class-transformer";
import { IsArray, IsEmail, isEmail, IsNumber, IsOptional, IsPhoneNumber, IsString, Max, MaxLength, ValidateNested } from "class-validator";
import { OrderProductDto } from "./order-product.dto";
import { PaymentInfoDto } from "./payment-info.dto";

export class CreateOrderDto {
    @IsString()
    @MaxLength(100)
    client: string;

    @IsPhoneNumber()
    @MaxLength(20)
    phone: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(50)
    email: string;

    @IsString()
    @MaxLength(200)
    address: string;

    @ValidateNested()
    @Type(() => PaymentInfoDto)
    payment: PaymentInfoDto;

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