import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { User } from 'src/users/users.model';
import { UserLoginDto } from 'src/users/dto/userLogin.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private jwtService: JwtService){}

    async login(userDto : UserLoginDto) {
        const user = await this.validateUser(userDto)

        if (user) {
            const {email, role, name, sectionId, id} = user
            let {token} = await this.generateToken(user)
            if (user.banned) {
                throw new HttpException('Пользователь заблокирован', HttpStatus.FORBIDDEN)
            } 
            return {
                id,
                email,
                role,
                token,
                name,
                sectionId
            }
        }
    }
    
    async registration(userDto : CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email)
        if (!candidate) {
            const hashPassword = await bcrypt.hash(userDto.password, 5);
            const user = await this.userService.createUser({...userDto, password: hashPassword})
            return true
        }
        else throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST)

        

    }

    private async generateToken(user: User) {
        const payload = {email: user.email, id: user.id,}
        return {
            token: this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: UserLoginDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        let passwordEquals
        if (user) {
            passwordEquals = await bcrypt.compare(userDto.password, user?.password)
        }
        if (passwordEquals) {
            return user
        }

        throw new UnauthorizedException({ message: 'Некорректный email или пароль' })
    }


}
