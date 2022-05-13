
import { IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    description: string;
}