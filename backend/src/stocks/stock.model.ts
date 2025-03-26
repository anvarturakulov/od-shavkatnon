import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, ForeignKey, Unique } from "sequelize-typescript";
import { Schet } from "src/interfaces/report.interface";
import { Reference } from "src/references/reference.model";

export interface StockCreationAttrs {
    schet: Schet
    date: bigint
    firstSubcontoId: number | null
    secondSubcontoId: number | null
    count: number
    total: number
    remainCount: number
    remainTotal: number
}


@Table({tableName: 'stocks'})
export class Stock extends Model<Stock, StockCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ApiProperty({example:'6010', description: 'Счет дебета'})
    @Column({type: DataType.ENUM(...Object.values(Schet))})
    schet: Schet

    @ApiProperty({example:'1735896554455', description: 'Дата проводки в миллисекундах'})
    @Column({type: DataType.BIGINT, })
    date: bigint;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - первого субконто по дебету'})
    @Column({type: DataType.INTEGER})
    firstSubcontoId: number | null

    @BelongsTo(() => Reference) 
    firstSubcontoReference: Reference;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - второго субконто по дебету'})
    @Column({type: DataType.INTEGER})
    secondSubcontoId: number | null

    @BelongsTo(() => Reference) 
    secondSubcontoReference: Reference;

    @ApiProperty({example:'10', description: 'Количество'})
    @Column({type: DataType.FLOAT})
    count: number;

    @ApiProperty({example:'150000', description: 'Всего'})
    @Column({type: DataType.FLOAT})
    total: number;

    @Column({ type: DataType.FLOAT })
    remainCount: number;

    @Column({ type: DataType.FLOAT })
    remainTotal: number;
    
    // @Unique({ name: 'stocks_unique_date', msg: 'One stock per date' })
    // static uniqueDateConstraint = ['schet', 'firstSubcontoId', 'secondSubcontoId', 'date'];

}