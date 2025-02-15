import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsString, Length, IsEnum, IsNumber, IsInt} from 'class-validator';
import { UserRoles } from "src/interfaces/user.interface";

export class CreateReferenceValueValueDto {

    @ApiProperty({example:'12222897', description: 'Идентификатор документа'})
    @IsInt({message: 'docId - должен быть натуральным числом'})
    docId: bigint

    @ApiProperty({example:'12222897', description: 'Id - аналитики'})
    @IsInt({message: 'analiticId - должен быть натуральным числом'})
    analiticId: number

    @ApiProperty({example:'654654', description: 'Старый id аналитики'})
    @IsString({message: 'analiticOldId - должен быть строкой'})
    analiticOldId: string;

    @ApiProperty({example:'10', description: 'Количество'})
    @IsNumber({}, {message: 'count - должен быть числом'})
    count: number;

    @ApiProperty({example:'15000', description: 'Цена'})
    @IsNumber({}, {message: 'price - должен быть числом'})
    price: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @IsNumber({}, {message: 'total - должен быть числом'})
    total: number;
}