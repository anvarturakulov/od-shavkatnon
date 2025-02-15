import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length} from 'class-validator';
import { UserRoles } from "src/interfaces/user.interface";

export class CreateUserDto {
    @ApiProperty({example:'user@mail.ru', description: 'Почтовый адрес'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: 'Не корректный email'})
    readonly email: string;

    @ApiProperty({example:'12345678', description: 'Пароль'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly password: string;

    @ApiProperty({example:'ADMIN', description: 'Роль'})
    @IsString({message: 'Должно быть строкой'})
    readonly role: UserRoles;

    @ApiProperty({example:'Shakhzod', description: 'Имя пользователя'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 16'})
    readonly name: UserRoles;
}