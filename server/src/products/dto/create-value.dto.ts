import { IsString } from "class-validator";

export class CreateValueDto {
    @IsString()
    name: string;
}