import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, ForeignKey } from "sequelize-typescript";
import { Document } from "src/documents/document.model";
import { OrderStatus } from "src/interfaces/document.interface";
import { Reference } from "src/references/reference.model";

export interface DocValuesCreationAttrs {
    docId: bigint
    senderId: number
    senderoldId: string
    receiverId: number
    receiverOldId: string
    analiticId: number
    analiticOldId: string
    productForChargeId: number
    firstWorkerId: number | null
    secondWorkerId: number | null
    thirdWorkerId: number | null
    isWorker: boolean
    isPartner: boolean
    isFounder: boolean
    isCash: boolean
    count: number
    price: number
    total: number
    cashFromPartner: number,
    cashFromPartnerSecond: number,
    cashFromPartnerThird: number,
    orderTakingDate: bigint,
    orderTakingTime: string,
    orderTakingDateSecond: bigint,
    orderTakingTimeSecond: string,
    orderTakingDateThird: bigint,
    orderTakingTimeThird: string,
    orderWithDeleviry: boolean,
    orderAdress: string,
    orderStatus: OrderStatus,
    countFirst: number,
    countSecond: number,
    countThird: number,
    saleFirst: number,
    saleSecond: number,
    saleThird: number,
}

@Table({tableName: 'docvalues'})
export class DocValues extends Model<DocValues, DocValuesCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ForeignKey(() => Document)
    @ApiProperty({example:'12222897', description: 'Идентификатор документа'})
    @Column({type: DataType.BIGINT})
    docId: bigint

    @BelongsTo(() => Document) 
    document: Document;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - отправителя'})
    @Column({type: DataType.INTEGER})
    senderId: number

    @BelongsTo(() => Reference) 
    senderReference: Reference;

    @ApiProperty({example:'654654', description: 'Старый id отправителя'})
    @Column({type: DataType.STRING})
    senderoldId: string;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - получателя'})
    @Column({type: DataType.INTEGER})
    receiverId: number

    @BelongsTo(() => Reference) 
    receiverReference: Reference;

    @ApiProperty({example:'654654', description: 'Старый id получателя'})
    @Column({type: DataType.STRING})
    receiverOldId: string;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - аналитики'})
    @Column({type: DataType.INTEGER})
    analiticId: number

    @BelongsTo(() => Reference) 
    analiticReference: Reference;

    @ApiProperty({example:'654654', description: 'Старый id аналитики'})
    @Column({type: DataType.STRING})
    analiticOldId: string;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - продукта для учета расходов'})
    @Column({type: DataType.INTEGER})
    productForChargeId: number

    @BelongsTo(() => Reference) 
    productForChargeReference: Reference;

    @ApiProperty({example:'true', description: 'isWorker?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isWorker: boolean;

    @ApiProperty({example:'true', description: 'isPartner?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isPartner: boolean;

    @ApiProperty({example:'true', description: 'isFounder?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isFounder: boolean;

    @ApiProperty({example:'true', description: 'isCash?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isCash: boolean;

    @ApiProperty({example:'10', description: 'Количество'})
    @Column({type: DataType.FLOAT})
    count: number;

    @ApiProperty({example:'15000', description: 'Цена'})
    @Column({type: DataType.FLOAT})
    price: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @Column({type: DataType.FLOAT})
    total: number;

    @ApiProperty({example:'150000', description: 'Полученные деньги с партнера'})
    @Column({type: DataType.FLOAT})
    cashFromPartner: number;
    
    @ApiProperty({example:'150000', description: 'Полученные деньги с партнера'})
    @Column({type: DataType.FLOAT})
    cashFromPartnerSecond: number;

    @ApiProperty({example:'150000', description: 'Полученные деньги с партнера'})
    @Column({type: DataType.FLOAT})
    cashFromPartnerThird: number;

    @ApiProperty({example:'....', description: 'Комментарий к документу'})
    @Column({type: DataType.STRING})
    comment: string;

    @ApiProperty({example:'1738368000000', description: 'Дата получения заказа в миллисекундах'})
    @Column({type: DataType.BIGINT})
    orderTakingDate: bigint;

    @ApiProperty({example:'....', description: 'Время получения заказа'})
    @Column({type: DataType.STRING})
    orderTakingTime: string;

    @ApiProperty({example:'1738368000000', description: 'Дата получения заказа в миллисекундах'})
    @Column({type: DataType.BIGINT})
    orderTakingDateSecond: bigint;

    @ApiProperty({example:'....', description: 'Время получения заказа'})
    @Column({type: DataType.STRING})
    orderTakingTimeSecond: string;

    @ApiProperty({example:'1738368000000', description: 'Дата получения заказа в миллисекундах'})
    @Column({type: DataType.BIGINT})
    orderTakingDateThird: bigint;

    @ApiProperty({example:'....', description: 'Время получения заказа'})
    @Column({type: DataType.STRING})
    orderTakingTimeThird: string;

    @ApiProperty({example:'true', description: 'Заказ с доставкой'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    orderWithDeleviry: boolean;
 
    @ApiProperty({example:'....', description: 'Адрес доставки заказа'})
    @Column({type: DataType.STRING})
    orderAdress: string;

    @ApiProperty({example:'OPEN', description: 'Тип статуса заказа - ( OPEN || DELETED || COMPLETED || ERROR )'})
    @Column({type: DataType.ENUM(...Object.values(OrderStatus))})
    orderStatus: OrderStatus

    @ApiProperty({example:'10', description: 'Количество 1'})
    @Column({type: DataType.FLOAT})
    countFirst: number;

    @ApiProperty({example:'10', description: 'Количество 2'})
    @Column({type: DataType.FLOAT})
    countSecond: number;

    @ApiProperty({example:'10', description: 'Количество 3'})
    @Column({type: DataType.FLOAT})
    countThird: number;

    @ApiProperty({example:'10', description: 'Количество 1'})
    @Column({type: DataType.FLOAT})
    saleFirst: number;

    @ApiProperty({example:'10', description: 'Количество 2'})
    @Column({type: DataType.FLOAT})
    saleSecond: number;

    @ApiProperty({example:'10', description: 'Количество 3'})
    @Column({type: DataType.FLOAT})
    saleThird: number;

}