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

    @ApiProperty({example:'12222', description: 'Кому относится клиент - идентификатор подразделения'})
    @IsString({message: 'clientForSectionOldId - должен быть строкой'})
    clientForSectionOldId?: string

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

    @ApiProperty({example:'false', description: 'Помечан на удаление?'})
    @IsBoolean({message: 'markToDeleted - значание должно быть TRUE или FALSE'})
    markToDeleted: boolean;

    @ApiProperty({example:'1.35', description: 'Норма затрат на ед. материала?'})
    @IsNumber({}, {message: 'norma - должен быть числом'})
    norma?: number;

    @ApiProperty({example:'true', description: 'Мука?'})
    @IsBoolean({message: 'un - значание должно быть TRUE или FALSE'})
    un?: boolean;

    @ApiProperty({example:'true', description: 'Долгосрочный тип затрат?'})
    @IsBoolean({message: 'longCharge - значание должно быть TRUE или FALSE'})
    longCharge?: boolean;

    @ApiProperty({example:'true', description: 'Личные затраты Шавката?'})
    @IsBoolean({message: 'shavkatCharge - значание должно быть TRUE или FALSE'})
    shavkatCharge?: boolean;

    @ApiProperty({example:'3400', description: 'Первая цена'})
    @IsNumber({}, {message: 'firstPrice - должен быть числом'})
    firstPrice?: number;

    @ApiProperty({example:'3800', description: 'Вторая цена'})
    @IsNumber({}, {message: 'secondPrice - должен быть числом'})
    secondPrice?: number;

    @ApiProperty({example:'4000', description: 'Третья цена'})
    @IsNumber({}, {message: 'thirdPrice - должен быть числом'})
    thirdPrice?: number;

    @ApiProperty({example:'....', description: 'Id телеграм'})
    @IsString({message: 'telegramId - должен быть строкой'})
    telegramId?: string;

    @ApiProperty({example:'....', description: 'Номер телефона'})
    @IsString({message: 'Номер телефона должно быть строкой'})
    phone?: string;

}