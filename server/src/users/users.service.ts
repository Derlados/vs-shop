import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/models/role.model';
import { RoleValues } from 'src/roles/roles.enum';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>) { }

    async createUser(dto: CreateUserDto): Promise<User> {
        const roles = await this.roleRepository.find({ name: In(dto.roles) })
        return this.userRepository.save({ ...dto, roles: roles });
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email: email }, relations: ["roles"] });
    }

    async addRoles(userId: number, newRoles: RoleValues[]) {
        const user = await this.userRepository.findOne({ id: userId })
        const roles = await this.roleRepository.find({ name: In(newRoles) })
        user.roles = roles;

        return this.userRepository.save(user);
    }
}
