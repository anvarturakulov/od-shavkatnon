import { ApiProperty } from "@nestjs/swagger";
import {IsInt, IsString, IsEnum, IsNumber, IsDate} from 'class-validator';
import { DocumentType } from "src/interfaces/document.interface";
import { Schet } from "src/interfaces/report.interface";

export class CreateEntryDto {

    @ApiProperty({example:'12-01-2025', description: 'Дата проводки'})
    @IsDate({message: 'date - должен быть датой'})
    date: Date;

    @ApiProperty({example:'6010', description: 'Счет дебета'})
    @IsEnum(Schet, {message: 'debet - должен быть из списка счетов'})
    schet: Schet

    @ApiProperty({example:'12222897', description: 'Id - первого субконто'})
    firstSubcontoId: number | null

    @ApiProperty({example:'12222897', description: 'Id - второго субконто'})
    secondSubcontoId: number | null

    @ApiProperty({example:'10', description: 'Количество'})
    @IsNumber({}, {message: 'count - должен быть номером'})
    count: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @IsNumber({}, {message: 'total - должен быть номером'})
    total: number;

}