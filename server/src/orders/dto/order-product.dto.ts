import { IsNumber } from "class-validator";

export class OrderProductDto {
    @IsNumber()
    id: number;

    @IsNumber()
    count: number;
}