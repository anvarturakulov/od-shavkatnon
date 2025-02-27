import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsEnum} from 'class-validator';
import { RefValues, TypeReference } from "src/interfaces/reference.interface";

export class UpdateCreateReferenceDto {
   
    @ApiProperty({example:'Нон', description: 'Название справочника'})
    @IsString({message: 'name - должен быть строкой'})
    name: string;

    @ApiProperty({example:'CHARGES', description: 'Тип справочника'})
    @IsEnum(TypeReference, {message: 'typeReference - должен быть из списка типов справочника'})
    typeReference: TypeReference

    refValues? : RefValues

}