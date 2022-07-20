import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderSorts } from "src/constants/OrderSrots";

export class GetOrdersQuery {
    @Transform(({ value }) => new Date(value))
    @IsOptional()
    @IsDate()
    startDate: Date;

    @Transform(({ value }) => new Date(value))
    @IsOptional()
    @IsDate()
    endDate: Date;

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNumber()
    page: number;

    @IsOptional()
    @IsEnum(OrderSorts)
    sort: OrderSorts;

    @IsOptional()
    @IsString()
    search: string;
}
