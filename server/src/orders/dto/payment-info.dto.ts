import { IsNumber } from "class-validator";

export class PaymentInfoDto {
    @IsNumber()
    id: number;
}