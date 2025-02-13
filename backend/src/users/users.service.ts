import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User ) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto)
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

    // async addRole(dto: AddRoleDto) {
    //     const user = await this.userRepository.findByPk(dto.userId)
    //     const role = await this.roleService.getRoleByValue(dto.value)
    //     if (user && role) {
    //         await user?.$add('role', role.id)
    //         return dto
    //     }
    //     throw new HttpException('Пользователь или роль не нашлась', HttpStatus.NOT_FOUND)
    // }


    // async banUser(dto: BanUserDto) {
    //     const user = await this.userRepository.findByPk(dto.userId)
    //     if (user) {
    //         user.banned = true;
    //         user.banReason = dto.banReason;
    //         await user.save()
    //         return user
    //     }
    //     throw new HttpException('Пользователь не нашлась', HttpStatus.NOT_FOUND)
    // }
}
