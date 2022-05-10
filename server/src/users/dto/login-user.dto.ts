import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    password: string;
}