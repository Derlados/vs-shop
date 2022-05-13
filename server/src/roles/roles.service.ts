import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './models/role.model';

@Injectable()
export class RolesService {

    constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) { }

    getRoles() {
        return this.roleRepository.find();
    }

    createRole(dto: CreateRoleDto) {
        return this.roleRepository.save(dto);
    }
}
