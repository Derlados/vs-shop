import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/reg')
    registration(@Body() dto: CreateUserDto) {
        return this.authService.registration(dto);
    }

    @Post('/login')
    login(@Body() dto: LoginUserDto) {
        return this.authService.login(dto);
    }
}
