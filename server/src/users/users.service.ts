import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async createUser(dto: CreateUserDto): Promise<User> {
        const result = await this.userRepository.insert(dto);
        const insertId = result.raw.insertId;

        return this.userRepository.findOne({ id: insertId });
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email: email });
    }
}
