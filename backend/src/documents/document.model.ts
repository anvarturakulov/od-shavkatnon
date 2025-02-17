import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, HasOne, ForeignKey } from "sequelize-typescript";
import { DocTableItem } from "src/docTableItems/docTableItem.model";
import { DocValue } from "src/docValues/docValue.model";
import { Entry } from "src/entries/entry.model";
import { DocSTATUS, DocumentType } from "src/interfaces/document.interface";
import { User } from "src/users/users.model";

interface DocumentCreationAttrs {
    date: Date;
    userId: number
    userOldId: string
    documentType: DocumentType
    docStatus: DocSTATUS
}


@Table({tableName: 'documents'})
export class Document extends Model<Document, DocumentCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ApiProperty({example:'12-01-2025', description: 'Дата документа'})
    @Column({type: DataType.DATE, })
    date: Date;

    @ForeignKey(() => User)
    @ApiProperty({example:'12222', description: 'Идентификатор пользователя'})
    @Column({type: DataType.INTEGER})
    userId: number

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

    @HasOne(() => DocValue)
    docValue!: DocValue;

    @HasMany(() => DocValue)
    docTableItems!: DocTableItem[];

    @HasMany(() => Entry)
    entries!: Entry[];

}