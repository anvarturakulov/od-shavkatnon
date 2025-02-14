import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table, HasMany, ForeignKey } from "sequelize-typescript";
import { Document } from "src/documents/document.model";
import { UserRoles } from "src/interfaces/user.interface";
import { Reference } from "src/references/references.model";

interface UserCreationAttrs {
    email: string,
    password: string
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

    @ApiProperty({example:'ADMIN', description: 'Роль пользователя'})
    @Column({type: DataType.ENUM(...Object.values(UserRoles)), allowNull: false})
    typeReference: UserRoles

    @ForeignKey(() => Reference)
    @Column({type: DataType.INTEGER})
    sectionId: number

    @HasMany(()=> Document)
    documents: Document[]

    // @BelongsToMany(()=> Role, () => UserRoles)
    // roles: Role[]

    // @HasMany(()=> Post)
    // posts: Post[]

}