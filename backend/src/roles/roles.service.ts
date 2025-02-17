import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/greate-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role ){}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto)
        return role
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role
    }

    async getRoleById(id: number) {
        const role = await this.roleRepository.findOne({where: {id}})
        return role
    }

    async getRoleValueById(id: number) {
        const role = await this.roleRepository.findOne({where: {id}})
        // console.log('Role service -',role?.dataValues.value)
        return role
    }
}
