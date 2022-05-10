import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

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
}