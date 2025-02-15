import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length, IsEnum, IsNumber, isString} from 'class-validator';
import { TypeReference } from "src/interfaces/reference.interface";
import { UserRoles } from "src/interfaces/user.interface";

export class CreateReferenceDto {
   
    @ApiProperty({example:'0000225522', description: 'Старый инденфикатор'})
    @IsString({message: 'oldId - должен быть строкой'})
    oldId: number;

    @ApiProperty({example:'Нон', description: 'Название справочника'})
    @IsString({message: 'name - должен быть строкой'})
    name: string;

    @ApiProperty({example:'CHARGES', description: 'Тип справочника'})
    @IsEnum(TypeReference, {message: 'typeReference - должен быть из списка типов справочника'})
    typeReference: TypeReference

}