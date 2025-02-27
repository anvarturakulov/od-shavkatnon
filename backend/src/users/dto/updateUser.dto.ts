import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsEmail, Length, IsEnum, IsBoolean, IsNumber} from 'class-validator';
import { UserRoles } from "src/interfaces/user.interface";

export class UpdateUserDto {
    @ApiProperty({example:'user@mail.ru', description: 'Почтовый адрес'})
    @IsString({message: 'email - должно быть строкой'})
    @IsEmail({}, {message: 'Не корректный email'})
    readonly email: string;

    @ApiProperty({example:'12345678', description: 'Пароль'})
    @IsString({message: 'password - должно быть строкой'})
    @Length(4, 100, {message: 'password - не меньше 4 и не больше 16'})
    readonly password: string;

    @ApiProperty({example:'Анвар', description: 'Имя'})
    @IsString({message: 'name - должно быть строкой'})
    @Length(4, 16, {message: 'name - не меньше 4 и не больше 16'})
    readonly name: string;

    @ApiProperty({example:'USER ROLE', description: 'Роль'})
    @IsString({message: 'role - должен быть строкой'})
    @IsEnum(UserRoles, {message: 'role - должен быть из списка ролей'})
    readonly role: UserRoles;

    @ApiProperty({example:'true', description: 'Роль'})
    @IsBoolean({message: 'banned - должен быть boolean'})
    readonly banned: boolean;

    @ApiProperty({example:'???', description: 'Причина блокировки или разблокировки пользователя'})
    // @IsString({message: 'banReason - должно быть строкой'})
    readonly banReason?: string;

    @ApiProperty({example:'12222897', description: 'Id - подразделения'})
    // @IsNumber({}, {message: 'sectionId - должен быть натуральным числом'})
    readonly sectionId: number

}