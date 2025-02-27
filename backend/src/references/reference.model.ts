import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table, HasOne } from "sequelize-typescript";
import { DocValue } from "src/docValues/docValue.model";
import { Entry } from "src/entries/entry.model";
import { TypeReference } from "src/interfaces/reference.interface";
import { RefValues } from "src/refvalues/refValues.model";
import { User } from "src/users/users.model";

interface ReferenceCreationAttrs {
    oldId?: string;
    name: string;
    typeReference: TypeReference
}


@Table({tableName: 'references'})
export class Reference extends Model<Reference, ReferenceCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example:'0000225522', description: 'Старый инденфикатор'})
    @Column({type: DataType.STRING})
    oldId: string;

    @ApiProperty({example:'Нон', description: 'Название справочника'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @ApiProperty({example:'CHARGES', description: 'Тип справочник '})
    @Column({type: DataType.ENUM(...Object.values(TypeReference)), allowNull: false})
    typeReference: TypeReference

    @HasOne(() => RefValues)
    refValues: RefValues;

    @HasOne(() => User)
    user: User;

    @HasOne(() => Entry)
    entry: Entry;

    @HasOne(() => DocValue)
    docValue: DocValue;


}