import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt} from 'class-validator';
import { DocumentType } from "src/interfaces/document.interface";

export class DuplicateDocs {
    
    @ApiProperty({example:'1738368000000', description: 'Дата клонируещих'})
    @IsInt({message: 'date - должен быть натуральным числом'})
    dateFrom: bigint;

    @ApiProperty({example:'1738368000000', description: 'Дата клонов'})
    @IsInt({message: 'date - должен быть натуральным числом'})
    dateTo: bigint;

    @ApiProperty({example:'ComeMaterial', description: 'Тип документа - для клона'})
    @IsEnum(DocumentType, {message: 'DocumentType - должен быть из списка типов документа'})
    documentType: DocumentType

    @ApiProperty({example:'12222', description: 'Идентификатор пользователя'})
    @IsInt({message: 'userId - должен быть натуральным числом'})
    userId: number

}