import { Type } from "class-transformer";
import { IsArray, IsEmail, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { CreateRoleDto } from "src/roles/dto/create-role.dto";

export class CreateUserDto {
    @IsString()
    @MaxLength(50)
    username: string;

    @IsString()
    @MaxLength(50)
    password: string;

    @IsEmail()
    @IsString()
    @MaxLength(50)
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    phone?: string;

    @IsOptional()
    @IsArray()
    @Type(() => CreateRoleDto)
    @ValidateNested({ each: true })
    roles?: CreateRoleDto[];
}