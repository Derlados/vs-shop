import { IsArray, IsNumber, IsString } from "class-validator";

export class ChangeStatusDto {
    @IsString()
    newStatus: string;
}