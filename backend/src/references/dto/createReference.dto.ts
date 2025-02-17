import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsEnum} from 'class-validator';
import { TypeReference } from "src/interfaces/reference.interface";

export class CreateReferenceDto {
   
    @ApiProperty({example:'0000225522', description: 'Старый инденфикатор'})
    @IsString({message: 'oldId - должен быть строкой'})
    oldId?: string;

    @ApiProperty({example:'Нон', description: 'Название справочника'})
    @IsString({message: 'name - должен быть строкой'})
    name: string;

    @ApiProperty({example:'CHARGES', description: 'Тип справочника'})
    @IsEnum(TypeReference, {message: 'typeReference - должен быть из списка типов справочника'})
    typeReference: TypeReference

}