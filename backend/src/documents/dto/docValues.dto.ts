import { ApiProperty } from "@nestjs/swagger";
import {IsString, IsNumber, IsBoolean, IsInt, IsEnum} from 'class-validator';
import { OrderStatus } from "src/interfaces/document.interface";

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

    @ApiProperty({example:'150000', description: 'Полученные деньги с партнера'})
    @IsNumber({}, {message: 'cashFromPartnerSecond - должно быть номером'})
    cashFromPartnerSecond: number;

    @ApiProperty({example:'150000', description: 'Полученные деньги с партнера'})
    @IsNumber({}, {message: 'cashFromPartnerThird - должно быть номером'})
    cashFromPartnerThird: number;

    @ApiProperty({example:'....', description: 'Комментарий к документу'})
    @IsString({message: 'comment - должен быть строкой'})
    comment: string;

    @ApiProperty({example:'1738368000000', description: 'Дата получения заказа в миллисекундах'})
    @IsInt({message: 'date - должен быть натуральным числом'})
    orderTakingDate: bigint;
    
    @ApiProperty({example:'....', description: 'Время получения заказа'})
    @IsString({message: 'orderTakingTime - должен быть строкой'})
    orderTakingTime: string;
    
     @ApiProperty({example:'1738368000000', description: 'Дата получения заказа в миллисекундах'})
    @IsInt({message: 'date - должен быть натуральным числом'})
    orderTakingDateSecond: bigint;
    
    @ApiProperty({example:'....', description: 'Время получения заказа'})
    @IsString({message: 'orderTakingTime - должен быть строкой'})
    orderTakingTimeSecond: string;

     @ApiProperty({example:'1738368000000', description: 'Дата получения заказа в миллисекундах'})
    @IsInt({message: 'date - должен быть натуральным числом'})
    orderTakingDateThird: bigint;
    
    @ApiProperty({example:'....', description: 'Время получения заказа'})
    @IsString({message: 'orderTakingTime - должен быть строкой'})
    orderTakingTimeThird: string;

    @ApiProperty({example:'true', description: 'Заказ с доставкой'})
    @IsBoolean({message: 'orderWithDeleviry Значание должно быть TRUE или FALSE'})
    orderWithDeleviry: boolean;
     
    @ApiProperty({example:'....', description: 'Адрес доставки заказа'})
    @IsString({message: 'orderAdress - должен быть строкой'})
    orderAdress: string;
    
    @ApiProperty({example:'OPEN', description: 'Тип статуса заказа - ( OPEN || DELETED || COMPLETED || ERROR )'})
    @IsEnum(OrderStatus, {message: 'orderStatus - должен быть из списка типов партнеров'})
    orderStatus: OrderStatus

    @ApiProperty({example:'10', description: 'Количество 1'})
    @IsNumber({}, {message: 'count 1 - должно быть номером'})
    countFirst: number;

    @ApiProperty({example:'10', description: 'Количество 2'})
    @IsNumber({}, {message: 'count 2 - должно быть номером'})
    countSecond: number;

    @ApiProperty({example:'10', description: 'Количество 3'})
    @IsNumber({}, {message: 'count 3 - должно быть номером'})
    countThird: number;

    @ApiProperty({example:'10', description: 'Количество 1'})
    @IsNumber({}, {message: 'saleFirst - должно быть номером'})
    saleFirst: number;

    @ApiProperty({example:'10', description: 'Количество 2'})
    @IsNumber({}, {message: 'saleSecond - должно быть номером'})
    saleSecond: number;

    @ApiProperty({example:'10', description: 'Количество 3'})
    @IsNumber({}, {message: 'saleThird - должно быть номером'})
    saleThird: number;
}