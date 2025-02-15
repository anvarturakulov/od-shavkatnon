import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, ForeignKey } from "sequelize-typescript";
import { TypePartners, TypeSECTION, TypeTMZ } from "src/interfaces/reference.interface";
import { Reference } from "src/references/references.model";

interface RefValueCreationAttrs {
    referenceId: number
    clientForSectionId: number
    typePartners: TypePartners
    typeTMZ: TypeTMZ
    typeSection: TypeSECTION
    unit: string;
    comment: string;
    norma: number;
    un: boolean;
    longCharge: boolean;

}

@Table({tableName: 'refvalues'})
export class RefValue extends Model<RefValue, RefValueCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.BIGINT, unique: true, autoIncrement: true, primaryKey: true})
    id: bigint;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222', description: 'Идентификатор справочника'})
    @Column({type: DataType.INTEGER})
    referenceId: number

    @BelongsTo(() => Reference) 
    reference!: Reference;
    
    @ApiProperty({example:'12222', description: 'Кому относится клиент - идентификатор подразделения'})
    @Column({type: DataType.INTEGER})
    clientForSectionId: number

    @ApiProperty({example:'CLIENTS', description: 'Тип партнера - ( CLIENTS || SUPPLIERS )'})
    @Column({type: DataType.ENUM(...Object.values(TypePartners))})
    typePartners: TypePartners

    @ApiProperty({example:'MATERIAL', description: 'Тип ТМЗ - ( MATERIAL || PRODUCT || HALFSTUFF )'})
    @Column({type: DataType.ENUM(...Object.values(TypeTMZ))})
    typeTMZ: TypeTMZ

    @ApiProperty({example:'DELIVERY', description: 'Тип подразделения - ( DELIVERY || FILIAL || COMMON || STORAGE || ACCOUNTANT || DIRECTOR || FOUNDER )'})
    @Column({type: DataType.ENUM(...Object.values(TypeSECTION))})
    typeSection: TypeSECTION

    @ApiProperty({example:'кг', description: 'Единица измерения'})
    @Column({type: DataType.STRING})
    unit: string;

    @ApiProperty({example:'....', description: 'Комментарий'})
    @Column({type: DataType.STRING})
    comment: string;

    @ApiProperty({example:'1.35', description: 'Норма затрат на ед. материала?'})
    @Column({type: DataType.FLOAT})
    norma: number;

    @ApiProperty({example:'true', description: 'Мука?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    un: boolean;

    @ApiProperty({example:'true', description: 'Долгосрочный тип затрат?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    longCharge: boolean;

}