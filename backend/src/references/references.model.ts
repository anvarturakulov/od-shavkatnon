import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table, HasMany, HasOne } from "sequelize-typescript";
import { TypeReference } from "src/interfaces/reference.interface";
import { RefValue } from "src/refvales/refValue.model";

interface ReferenceCreationAttrs {
    email: string,
    password: string
}


@Table({tableName: 'references'})
export class Reference extends Model<Reference, ReferenceCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example:'0000225522', description: 'Старый инденфикатор'})
    @Column({type: DataType.STRING})
    oldId: number;

    @ApiProperty({example:'Нон', description: 'Название справочника'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    name: string;

    @ApiProperty({example:'CHARGES', description: 'Тип справочник '})
    @Column({type: DataType.ENUM(...Object.values(TypeReference)), allowNull: false})
    typeReference: TypeReference

    @HasOne(() => RefValue)
    refValue!: RefValue;

}