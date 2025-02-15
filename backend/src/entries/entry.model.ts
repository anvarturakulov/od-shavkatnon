import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, HasOne, ForeignKey } from "sequelize-typescript";
import { DocTableItem } from "src/docTableItems/docTableItem.model";
import { Document } from "src/documents/document.model";
import { DocValue } from "src/docValues/docValue.model";
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";
import { Schet } from "src/interfaces/report.interface";
import { Reference } from "src/references/references.model";
import { User } from "src/users/users.model";

interface EntryCreationAttrs {
    email: string,
    password: string
}


@Table({tableName: 'entries'})
export class Entry extends Model<Entry, EntryCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ForeignKey(() => Document)
    @ApiProperty({example:'12222', description: 'Идентификатор документа'})
    @Column({type: DataType.INTEGER})
    documentId: number

    @BelongsTo(() => Document) 
    document: Document;
    
    @ApiProperty({example:'12-01-2025', description: 'Дата проводки'})
    @Column({type: DataType.DATE, })
    date: Date;

    @ApiProperty({example:'ComeMaterial', description: 'Тип документа - ( из списка документов )'})
    @Column({type: DataType.ENUM(...Object.values(DocumentType))})
    documentType: DocumentType

    @ApiProperty({example:'DELIVERY', description: 'Счет дебета'})
    @Column({type: DataType.ENUM(...Object.values(Schet))})
    debet: Schet

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - первого субконто по дебету'})
    @Column({type: DataType.INTEGER})
    debetFirstSubcontoId: number

    @BelongsTo(() => Reference) 
    debetFirstSubcontoReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - второго субконто по дебету'})
    @Column({type: DataType.INTEGER})
    debetSecondSubcontoId: number

    @BelongsTo(() => Reference) 
    debetSecondSubcontoReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - третьего субконто по дебету'})
    @Column({type: DataType.INTEGER})
    debetThirdSubcontoId: number

    @BelongsTo(() => Reference) 
    debetThirdSubcontoReference: Reference;

    @ApiProperty({example:'DELIVERY', description: 'Счет кредита'})
    @Column({type: DataType.ENUM(...Object.values(Schet))})
    kredit: Schet

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - первого субконто по кредиту'})
    @Column({type: DataType.INTEGER})
    kreditFirstSubcontoId: number

    @BelongsTo(() => Reference) 
    kreditFirstSubcontoReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - второго субконто по кредиту'})
    @Column({type: DataType.INTEGER})
    kreditSecondSubcontoId: number

    @BelongsTo(() => Reference) 
    kreditSecondSubcontoReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - третьего субконто по кредиту'})
    @Column({type: DataType.INTEGER})
    kreditThirdSubcontoId: number

    @BelongsTo(() => Reference) 
    kreditThirdSubcontoReference: Reference;

    @ApiProperty({example:'10', description: 'Количество'})
    @Column({type: DataType.NUMBER})
    count: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @Column({type: DataType.NUMBER})
    total: number;
    
}