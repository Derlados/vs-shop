import { ConflictException, Injectable, NotFoundException, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/users/models/user.model';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async registration(dto: CreateUserDto) {
        const candidate = await this.usersService.getUserByEmail(dto.email);
        if (candidate) {
            throw new ConflictException("Пользователь с таким именем уже существует");
        }

        const hashPassword = bcrypt.hashSync(dto.password, 5);
        dto.password = hashPassword;
        const user = await this.usersService.createUser(dto);

        return this.createToken(user);
    }

    async login(dto: LoginUserDto) {
        const user = await this.usersService.getUserByEmail(dto.email);
        if (user && bcrypt.compareSync(dto.password, user.password)) {
            return this.createToken(user);
        } else {
            throw new NotFoundException("Пользователь с таким email-ом или паролем не найден")
        }
    }

    private createToken(user: User) {
        const payload = { id: user.id, username: user.username, roles: user.roles }
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
