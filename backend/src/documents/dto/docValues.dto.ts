import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsNumber, IsBoolean, IsInt} from 'class-validator';

export class DocValuesDto {

    @ApiProperty({example:'12222897', description: 'Идентификатор документа'})
    @IsInt( {message: 'docId - должен быть натуральным числом'})
    docId: bigint

    @ApiProperty({example:'12222897', description: 'Id - отправителя'})
    @IsNumber({}, {message: 'senderId - должен быть натуральным числом'})
    senderId: number

    @ApiProperty({example:'654654', description: 'Старый id отправителя'})
    @IsString({message: 'senderoldId - должен быть строкой'})
    senderoldId: string;

    @ApiProperty({example:'12222897', description: 'Id - получателя'})
    @IsInt({message: 'receiverId - должен быть натуральным числом'})
    receiverId: number

    @ApiProperty({example:'654654', description: 'Старый id получателя'})
    @IsString({message: 'senderoldId - должен быть строкой'})
    receiverOldId: string;

    @ApiProperty({example:'12222897', description: 'Id - аналитики'})
    @IsInt({message: 'analiticId - должен быть натуральным числом'})
    analiticId: number

    @ApiProperty({example:'654654', description: 'Старый id аналитики'})
    @IsString({message: 'analiticOldId - аналитики должен быть строкой'})
    analiticOldId: string;

    @ApiProperty({example:'12222897', description: 'Id - аналитики'})
    @IsInt({message: 'analiticId - должен быть натуральным числом'})
    productForChargeId: number

    @ApiProperty({example:'true', description: 'isWorker?'})
    @IsBoolean({message: 'isWorker Значание должно быть TRUE или FALSE'})
    isWorker: boolean;

    @ApiProperty({example:'true', description: 'isPartner?'})
    @IsBoolean({message: 'isPartner Значание должно быть TRUE или FALSE'})
    isPartner: boolean;

    @ApiProperty({example:'true', description: 'isFounder?'})
    @IsBoolean({message: 'isFounder Значание должно быть TRUE или FALSE'})
    isFounder: boolean;

    @ApiProperty({example:'true', description: 'isCash?'})
    @IsBoolean({message: 'isCash Значание должно быть TRUE или FALSE'})
    isCash: boolean;

    @ApiProperty({example:'10', description: 'Количество'})
    @IsNumber({}, {message: 'count - должно быть номером'})
    count: number;

    @ApiProperty({example:'15000', description: 'Цена'})
    @IsNumber({}, {message: 'price - должно быть номером'})
    price: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @IsNumber({}, {message: 'total - должно быть номером'})
    total: number;

    @ApiProperty({example:'150000', description: 'Полученные деньги с партнера'})
    @IsNumber({}, {message: 'cashFromPartner - должно быть номером'})
    cashFromPartner: number;

    @ApiProperty({example:'....', description: 'Комментарий к документу'})
    @IsString({message: 'comment - должен быть строкой'})
    comment: string;

}