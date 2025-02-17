import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/createUser.dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { UserRoles } from 'src/roles/user-roles.model';
import { Role } from 'src/roles/roles.model';


@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @InjectModel(UserRoles) private userRolesRepository: typeof UserRoles,
        @InjectModel(Role) private rolesRepository: typeof Role,
        private roleService: RolesService ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto)
        const role = await this.roleService.getRoleByValue("USER")
        if (role) {
            await user.$set('roles', [role.id])
            user.roles = [role]
        }
        return user;

    }

    async getUsers() {
        const users = await this.userRepository.findAll({include: {all: true}})
        return users
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleService.getRoleByValue(dto.value)
        if (user && role) {
            await user?.$add('role', role.id)
            return dto
        }
        throw new HttpException('Пользователь или роль не нашлась', HttpStatus.NOT_FOUND)
    }

    async getUserRolesByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        if (user) {
            let roles = user?.roles.map(item => {
                return item.dataValues.value
            })
            console.log('roles by user service', roles)
            return roles
        }
        throw new HttpException('Роли не нашлась', HttpStatus.NOT_FOUND)
    }



    async banUser(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        if (user) {
            user.banned = true;
            user.banReason = dto.banReason;
            await user.save()
            return user
        }
        throw new HttpException('Пользователь не нашлась', HttpStatus.NOT_FOUND)
    }
}
