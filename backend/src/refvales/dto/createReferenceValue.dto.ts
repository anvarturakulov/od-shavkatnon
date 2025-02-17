import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString, Length, IsEnum, IsNumber, IsBoolean} from 'class-validator';
import { TypePartners, TypeSECTION, TypeTMZ } from "src/interfaces/reference.interface";

export class CreateReferenceValueDto {
    
    @ApiProperty({example:'12222', description: 'Идентификатор справочника'})
    @IsInt({message: 'referenceId - должен быть натуральным числом'})
    referenceId: number
    
    @ApiProperty({example:'12222', description: 'Кому относится клиент - идентификатор подразделения'})
    @IsInt({message: 'clientForSectionId - должен быть натуральным числом'})
    clientForSectionId?: number

    @ApiProperty({example:'CLIENTS', description: 'Тип партнера - ( CLIENTS || SUPPLIERS )'})
    @IsEnum(TypePartners, {message: 'typePartners - должен быть из списка типов партнеров'})
    typePartners?: TypePartners

    @ApiProperty({example:'MATERIAL', description: 'Тип ТМЗ - ( MATERIAL || PRODUCT || HALFSTUFF )'})
    @IsEnum(TypeTMZ, {message: 'typeTMZ - должен быть из списка типов ТМЗ'})
    typeTMZ?: TypeTMZ

    @ApiProperty({example:'DELIVERY', description: 'Тип подразделения - ( DELIVERY || FILIAL || COMMON || STORAGE || ACCOUNTANT || DIRECTOR || FOUNDER )'})
    @IsEnum(TypeSECTION, {message: 'typeSection - должен быть из списка типов подразделения'})
    typeSection?: TypeSECTION

    @ApiProperty({example:'кг', description: 'Единица измерения'})
    @IsString({message: 'unit - должен быть строкой'})
    unit?: string;

    @ApiProperty({example:'....', description: 'Единица измерения'})
    @IsString({message: 'comment - должен быть строкой'})
    comment?: string;

    @ApiProperty({example:'1.35', description: 'Норма затрат на ед. материала?'})
    @IsNumber({}, {message: 'norma - должен быть числом'})
    norma?: number;

    @ApiProperty({example:'true', description: 'Мука?'})
    @IsBoolean({message: 'un - значание должно быть TRUE или FALSE'})
    un?: boolean;

    @ApiProperty({example:'true', description: 'Долгосрочный тип затрат?'})
    @IsBoolean({message: 'longCharge - значание должно быть TRUE или FALSE'})
    longCharge?: boolean;

}