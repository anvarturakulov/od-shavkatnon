import { UserRoles } from "./general.interface";

export interface UserModel {
    _id?: string,
    login: string,
    password: string,
    role: UserRoles,
    name: string,
    storageId: string,
    tandirId: string,
    productId: string,
    deleted: boolean,
}



