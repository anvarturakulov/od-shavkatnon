import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, ForeignKey } from "sequelize-typescript";
import { Document } from "src/documents/document.model";
import { TypePartners, TypeSECTION, TypeTMZ } from "src/interfaces/reference.interface";
import { Reference } from "src/references/references.model";

interface DocValueCreationAttrs {
    referenceId: number,
}

@Table({tableName: 'docvalues'})
export class DocValue extends Model<DocValue, DocValueCreationAttrs> {

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

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - получателя'})
    @Column({type: DataType.INTEGER})
    receiverId: number

    @BelongsTo(() => Reference) 
    receiverReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - аналитики'})
    @Column({type: DataType.INTEGER})
    analiticId: number

    @BelongsTo(() => Reference) 
    analiticReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - первого рабочего'})
    @Column({type: DataType.INTEGER})
    firstWorkerId: number

    @BelongsTo(() => Reference) 
    firstWorkerReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - второго рабочего'})
    @Column({type: DataType.INTEGER})
    secondWorkerId: number

    @BelongsTo(() => Reference) 
    secondWorkerReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - третьего рабочего'})
    @Column({type: DataType.INTEGER})
    thirdWorkerId: number

    @BelongsTo(() => Reference) 
    thirdWorkerIdReference: Reference;




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
    @Column({type: DataType.NUMBER})
    count: number;

    @ApiProperty({example:'15000', description: 'Цена'})
    @Column({type: DataType.NUMBER})
    price: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @Column({type: DataType.NUMBER})
    total: number;

    @ApiProperty({example:'150000', description: 'Полученные деньги с партнера'})
    @Column({type: DataType.NUMBER})
    cashFromPartner: number;


}