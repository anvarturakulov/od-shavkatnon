import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, ForeignKey } from "sequelize-typescript";
import { Document } from "src/documents/document.model";
import { DocumentType } from "src/interfaces/document.interface";
import { Schet } from "src/interfaces/report.interface";
import { Reference } from "src/references/reference.model";

export interface EntryCreationAttrs {
    date: bigint
    documentType: DocumentType
    docId: bigint
    debet: Schet
    debetFirstSubcontoId: number | null
    debetSecondSubcontoId: number | null
    debetThirdSubcontoId?: number | null
    kredit: Schet
    kreditFirstSubcontoId: number | null
    kreditSecondSubcontoId: number | null
    kreditThirdSubcontoId?: number | null
    count: number
    total: number
    description?: string
}


@Table({tableName: 'entries'})
export class Entry extends Model<Entry, EntryCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ForeignKey(() => Document)
    @ApiProperty({example:'12222', description: 'Идентификатор документа'})
    @Column({type: DataType.BIGINT})
    docId: bigint

    @BelongsTo(() => Document) 
    document: Document;
    
    @ApiProperty({example:'1735896554455', description: 'Дата проводки в миллисекундах'})
    @Column({type: DataType.BIGINT, })
    date: bigint;

    @ApiProperty({example:'ComeMaterial', description: 'Тип документа - ( из списка документов )'})
    @Column({type: DataType.ENUM(...Object.values(DocumentType))})
    documentType: DocumentType

    @ApiProperty({example:'6010', description: 'Счет дебета'})
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

    @ApiProperty({example:'5010', description: 'Счет кредита'})
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
    @Column({type: DataType.FLOAT})
    count: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @Column({type: DataType.FLOAT})
    total: number;

    @ApiProperty({example:'Поступление материалов от ....', description: 'Описание проводки'})
    @Column({type: DataType.STRING})
    description: string;
    
}