import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";
import { OrderStatus } from "src/constants/OrderStatus";

export class ChangeStatusDto {
    @IsString()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}