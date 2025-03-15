import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsDate, IsInt} from 'class-validator';
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";
import { DocTableItemDto } from "./docTableItem.dto";
import { DocValuesDto } from "./docValues.dto";

export class UpdateCreateDocumentDto {
    
    @ApiProperty({example:'1738368000000', description: 'Дата документа в миллисекундах'})
    @IsInt({message: 'date - должен быть натуральным числом'})
    date: bigint;

    @ApiProperty({example:'12222', description: 'Идентификатор пользователя'})
    @IsInt({message: 'userId - должен быть натуральным числом'})
    userId: number

    @ApiProperty({example:'12222', description: 'Идентификатор пользователя'})
    @IsString({message: 'userOldId - должен быть строкой'})
    userOldId?: string

    @ApiProperty({example:'ComeMaterial', description: 'Тип документа - из списка документов'})
    @IsEnum(DocumentType, {message: 'DocumentType - должен быть из списка типов документа'})
    documentType: DocumentType

    @ApiProperty({example:'OPEN', description: 'Статус документа - ( OPEN || DELETED || PROVEDEN )'})
    @IsEnum(DocSTATUS, {message: 'DocSTATUS - должен быть из списка типов статуса документа'})
    docStatus: DocSTATUS

    docValues: DocValuesDto

    docTableItems: DocTableItemDto[]
}