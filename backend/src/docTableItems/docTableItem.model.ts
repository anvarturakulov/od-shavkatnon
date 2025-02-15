import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, ForeignKey } from "sequelize-typescript";
import { Document } from "src/documents/document.model";
import { TypePartners, TypeSECTION, TypeTMZ } from "src/interfaces/reference.interface";
import { Reference } from "src/references/references.model";

interface DocTableItemCreationAttrs {
    docId: bigint
    analiticId: number
    analiticOldId: number
    count: number
    price: number
    total: number
}

@Table({tableName: 'doctableitems'})
export class DocTableItem extends Model<DocTableItem, DocTableItemCreationAttrs> {

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
    @ApiProperty({example:'12222897', description: 'Id - аналитики'})
    @Column({type: DataType.INTEGER})
    analiticId: number

    @ApiProperty({example:'654654', description: 'Старый id аналитики'})
    @Column({type: DataType.STRING})
    analiticOldId: string;

    @BelongsTo(() => Reference) 
    analiticReference: Reference;

    @ApiProperty({example:'10', description: 'Количество'})
    @Column({type: DataType.NUMBER})
    count: number;

    @ApiProperty({example:'15000', description: 'Цена'})
    @Column({type: DataType.NUMBER})
    price: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @Column({type: DataType.NUMBER})
    total: number;

}