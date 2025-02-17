import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { Roles } from './roles-auth.decorator';
import { RolesGuard } from './roles.guard';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/login')
    login(@Body() userDto : CreateUserDto) {
        return this.authService.login(userDto)
    }


    // @ApiOperation({summary: 'Выдать роль'})
    // @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/registration')
    registration(@Body() userDto : CreateUserDto) {
        return this.authService.registration(userDto)
    }
}
