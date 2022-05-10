import { IsArray, IsNumber } from "class-validator";

export class CompleteOrdersDto {
    @IsArray()
    @IsNumber({}, { each: true })
    orderIds: number[];
}