import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table, HasMany, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import { Document } from "src/documents/document.model";
import { Reference } from "src/references/references.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

interface UserCreationAttrs {
    email: string;
    password: string;
    oldId?: string;
}


@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({example:'1', description: 'Уникальный иденфикатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example:'98798764', description: 'Старый индефикатор пользователя'})
    @Column({type: DataType.STRING})
    oldId: string;

    @ApiProperty({example:'user@mail.ru', description: 'Почтовый адрес'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example:'12345678', description: 'Пароль'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example:'true', description: 'Забанен или нет'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example:'За хулиганство', description: 'Причина блокировки'})
    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    // @ApiProperty({example:'ADMIN', description: 'Роль пользователя'})
    // @Column({type: DataType.ENUM(...Object.values(UserRoles)), allowNull: false})
    // role: UserRoles

    @ForeignKey(() => Reference)
    @ApiProperty({example:'12222897', description: 'Id - подразделения'})
    @Column({type: DataType.INTEGER})
    sectionId: number

    @BelongsTo(() => Reference) 
    referenceForSection: Reference;

    @HasMany(()=> Document)
    documents: Document[]

    @BelongsToMany(()=> Role, () => UserRoles)
    roles: Role[]

}