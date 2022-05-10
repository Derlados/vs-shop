import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class KeyAttributeDto {
    @IsString()
    attribute: string;

    @IsBoolean()
    isRange: boolean;

    @IsOptional()
    @IsNumber()
    step?: number;
}

