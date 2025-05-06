import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, Model, Table, HasMany, ForeignKey } from "sequelize-typescript";
import { TypePartners, TypeSECTION, TypeTMZ } from "src/interfaces/reference.interface";
import { Reference } from "src/references/reference.model";

interface RefValuesCreationAttrs {
    referenceId: number
    clientForSectionId?: number
    clientForSectionOldId?: string
    typePartners?: TypePartners
    typeTMZ?: TypeTMZ
    typeSection?: TypeSECTION
    unit?: string;
    comment?: string;
    norma?: number;
    un?: boolean;
    longCharge?: boolean;
    shavkatCharge?: boolean,
    firstPrice?: number,
    secondPrice?: number,
    thirdPrice?: number,
    telegramId?: string,
}

@Table({tableName: 'refvalues'})
export class RefValues extends Model<RefValues, RefValuesCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222', description: 'Идентификатор справочника'})
    @Column({type: DataType.INTEGER})
    referenceId: number

    @BelongsTo(() => Reference) 
    reference: Reference;
    
    @ApiProperty({example:'12222', description: 'Кому относится клиент - идентификатор подразделения'})
    @Column({type: DataType.INTEGER})
    clientForSectionId?: number

    @ApiProperty({example:'asfasfas', description: 'Старый ид - Кому относится клиент - идентификатор подразделения'})
    @Column({type: DataType.STRING})
    clientForSectionOldId?: string

    @ApiProperty({example:'CLIENTS', description: 'Тип партнера - ( CLIENTS || SUPPLIERS )'})
    @Column({type: DataType.ENUM(...Object.values(TypePartners))})
    typePartners?: TypePartners

    @ApiProperty({example:'MATERIAL', description: 'Тип ТМЗ - ( MATERIAL || PRODUCT || HALFSTUFF )'})
    @Column({type: DataType.ENUM(...Object.values(TypeTMZ))})
    typeTMZ?: TypeTMZ

    @ApiProperty({example:'DELIVERY', description: 'Тип подразделения - ( DELIVERY || FILIAL || COMMON || STORAGE || ACCOUNTANT || DIRECTOR || FOUNDER )'})
    @Column({type: DataType.ENUM(...Object.values(TypeSECTION))})
    typeSection?: TypeSECTION

    @ApiProperty({example:'кг', description: 'Единица измерения'})
    @Column({type: DataType.STRING})
    unit?: string;

    @ApiProperty({example:'....', description: 'Комментарий'})
    @Column({type: DataType.STRING})
    comment?: string;

    @ApiProperty({example:'false', description: 'Помечан на удаление?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    markToDeleted?: boolean;

    @ApiProperty({example:'1.35', description: 'Норма затрат на ед. материала?'})
    @Column({type: DataType.FLOAT})
    norma?: number;

    @ApiProperty({example:'true', description: 'Мука?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    un?: boolean;

    @ApiProperty({example:'true', description: 'Долгосрочный тип затрат?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    longCharge?: boolean;

    @ApiProperty({example:'true', description: 'Личные затраты Шавката?'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    shavkatCharge?: boolean;

    @ApiProperty({example:'3400', description: 'Первая цена'})
    @Column({type: DataType.FLOAT})
    firstPrice?: number;

    @ApiProperty({example:'3800', description: 'Вторая цена'})
    @Column({type: DataType.FLOAT})
    secondPrice?: number;

    @ApiProperty({example:'4000', description: 'Третья цена'})
    @Column({type: DataType.FLOAT})
    thirdPrice?: number;

    @ApiProperty({example:'....', description: 'Id телеграм'})
    @Column({type: DataType.STRING})
    telegramId?: string;
    
    @ApiProperty({example:'....', description: 'Номер телефона'})
    @Column({
        type: DataType.STRING, allowNull: true,
        unique: true,
        validate: {
          is: {
            args: /^\+?[1-9]\d{1,11}$/, // Пример регулярного выражения для номера телефона
            msg: 'Некорректный формат номера телефона',
          }}
        })
    phone?: string;

}