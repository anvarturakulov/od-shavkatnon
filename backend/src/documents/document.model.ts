import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, HasOne, ForeignKey } from "sequelize-typescript";
import { DocTableItems } from "src/docTableItems/docTableItems.model";
import { DocValues } from "src/docValues/docValues.model";
import { Entry } from "src/entries/entry.model";
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";
import { User } from "src/users/users.model";

export interface DocumentCreationAttrs {
    date: bigint;
    userId: number
    documentType: DocumentType
    docStatus: DocSTATUS
}


@Table({tableName: 'documents'})
export class Document extends Model<Document, DocumentCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ApiProperty({example:'1738368000000', description: 'Дата документа в миллисекундах'})
    @Column({type: DataType.BIGINT})
    date: bigint;

    @ForeignKey(() => User)
    @ApiProperty({example:'12222', description: 'Идентификатор пользователя'})
    @Column({type: DataType.INTEGER})
    userId?: number

    @ApiProperty({example:'36899955', description: 'Старый идентификатор пользователя'})
    @Column({type: DataType.STRING})
    userOldId: string

    @ApiProperty({example:'ComeMaterial', description: 'Тип документа - ( из списка документов )'})
    @Column({type: DataType.ENUM(...Object.values(DocumentType))})
    documentType: DocumentType

    @ApiProperty({example:'OPEN', description: 'Статус документа - ( OPEN || DELETED || PROVEDEN )'})
    @Column({type: DataType.ENUM(...Object.values(DocSTATUS))})
    docStatus: DocSTATUS

    @BelongsTo(() => User) 
    user!: User;

    @HasOne(() => DocValues)
    docValues!: DocValues;

    @HasMany(() => DocTableItems)
    docTableItems!: DocTableItems[];

    @HasMany(() => Entry)
    entries!: Entry[];

}