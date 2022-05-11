import { IsString, Max } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @Max(50)
    name: string;

    @IsString()
    description: string;


}