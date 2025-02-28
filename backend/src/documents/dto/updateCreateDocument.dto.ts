import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length, IsEnum, IsDate, IsNumber, IsInt} from 'class-validator';
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";

export class UpdateCreateDocumentDto {
    @ApiProperty({example:'12-01-2025', description: 'Дата документа'})
    @IsDate({message: 'date - должен быть датой'})
    date: Date;

    @ApiProperty({example:'12222', description: 'Идентификатор пользователя'})
    @IsInt({message: 'userId - должен быть натуральным числом'})
    userId: number

    @ApiProperty({example:'36899955', description: 'Старый идентификатор пользователя'})
    @IsString({message: 'userOldId - должен быть строкой'})
    userOldId: string

    @ApiProperty({example:'ComeMaterial', description: 'Тип документа - из списка документов'})
    @IsEnum(DocumentType, {message: 'DocumentType - должен быть из списка типов документа'})
    documentType: DocumentType

    @ApiProperty({example:'OPEN', description: 'Статус документа - ( OPEN || DELETED || PROVEDEN )'})
    @IsEnum(DocSTATUS, {message: 'DocSTATUS - должен быть из списка типов статуса документа'})
    docStatus: DocSTATUS

}