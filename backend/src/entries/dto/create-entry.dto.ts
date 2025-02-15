import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length, IsEnum, IsNumber, IsDate, isEnum} from 'class-validator';
import { DocumentType } from "src/interfaces/document.interface";
import { Schet } from "src/interfaces/report.interface";

export class CreateEntryDto {

    @ApiProperty({example:'12222', description: 'Идентификатор документа'})
    @IsNumber({}, {message: 'Номер документа должен быть номером'})
    readonly documentId: number

    @ApiProperty({example:'12-01-2025', description: 'Дата проводки'})
    @IsDate({message: 'Дата документа должен быть датой'})
    readonly date: Date;

    @ApiProperty({example:'ComeMaterial', description: 'Тип документа - ( из списка документов )'})
    @IsEnum(DocumentType, {message: 'Тип документа - должен быть из списка документов'})
    documentType: DocumentType

    @ApiProperty({example:'6010', description: 'Счет дебета'})
    @IsEnum(Schet, {message: 'Счет дебета - должен быть из списка счетов'})
    debet: Schet

    @ApiProperty({example:'12222897', description: 'Id - первого субконто по дебету'})
    @IsNumber({}, {message: 'Id первого субконто по дебету должен быть номером'})
    debetFirstSubcontoId: number

    @ApiProperty({example:'12222897', description: 'Id - второго субконто по дебету'})
    @IsNumber({}, {message: 'Id второго субконто по дебету должен быть номером'})
    debetSecondSubcontoId: number

    @ApiProperty({example:'12222897', description: 'Id - третьего субконто по дебету'})
    @IsNumber({}, {message: 'Id третьего субконто по дебету должен быть номером'})
    debetThirdSubcontoId: number

    @ApiProperty({example:'DELIVERY', description: 'Счет кредита'})
    @IsEnum(Schet, {message: 'Счет кредита - должен быть из списка счетов'})
    kredit: Schet

    @ApiProperty({example:'12222897', description: 'Id - первого субконто по кредиту'})
    @IsNumber({}, {message: 'Id второго субконто по дебету должен быть номером'})
    kreditFirstSubcontoId: number

    @ApiProperty({example:'12222897', description: 'Id - второго субконто по кредиту'})
    @IsNumber({}, {message: 'Id второго субконто по кредиту должен быть номером'})
    kreditSecondSubcontoId: number

    @ApiProperty({example:'12222897', description: 'Id - третьего субконто по кредиту'})
    @IsNumber({}, {message: 'Id третьего субконто по дебету должен быть номером'})
    kreditThirdSubcontoId: number

    @ApiProperty({example:'10', description: 'Количество'})
    @IsNumber({}, {message: 'Количество должен быть номером'})
    count: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @IsNumber({}, {message: 'Сумма должен быть номером'})
    total: number;

    @ApiProperty({example:'Поступление материалов', description: 'Описание проводки'})
    @IsString({message: 'Описание проводки должен быть строкой'})
    description: string;

}