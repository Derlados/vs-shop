import { Type } from "class-transformer";
import { IsArray, IsEmail, IsEnum, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { CreateRoleDto } from "src/roles/dto/create-role.dto";
import { RoleValues } from "src/roles/roles.enum";

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
    @IsEnum(RoleValues, { each: true })
    roles: RoleValues[] = [RoleValues.USER];
}