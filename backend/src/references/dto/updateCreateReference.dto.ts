import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsEnum} from 'class-validator';
import { RefValues, TypeReference } from "src/interfaces/reference.interface";
import { CreateReferenceValueDto } from "src/refvalues/dto/createReferenceValues.dto";

export class UpdateCreateReferenceDto {
   
    @ApiProperty({example:'Нон', description: 'Название справочника'})
    @IsString({message: 'name - должен быть строкой'})
    name: string;

    @ApiProperty({example:'CHARGES', description: 'Тип справочника'})
    @IsEnum(TypeReference, {message: 'typeReference - должен быть из списка типов справочника'})
    typeReference: TypeReference

    @ApiProperty({example:'56987456996655', description: 'Старый id справочника'})
    @IsString({message: 'oldId - должен быть строкой'})
    oldId?: string;

    refValues? : CreateReferenceValueDto

}