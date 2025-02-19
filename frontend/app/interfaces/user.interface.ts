export enum UserRoles {
    ADMIN = 'ADMIN',
    HEADCOMPANY = 'HEADCOMPANY',
    GLBUX = 'GLBUX',
    ZAMGLBUX = 'ZAMGLBUX',
    TANDIR = 'TANDIR',
    HEADSECTION = 'HEADSECTION',
    DELIVERY = 'DELIVERY',
    SELLER = 'SELLER',
    GUEST = 'GUEST',
    ZP = 'ZP',
    KASSIR = 'KASSIR',
    USER = 'USER'
}

export interface User {
    id?: number,
    email: string,
    access_token: string;
    name: string,
    banned?: boolean,
    banReason?: string,
    sectionId: number, 
    roles: UserRoles[],
}

export interface UserModel {
    id?: number,
    oldId?: string,
    email: string,
    password: string,
    name: string,
    banned?: boolean,
    banReason?: string,
    sectionId?: number,
    roles: UserRoles[]
}

export interface BodyForLogin {
    email: string,
    password: string,
}

export interface DefinedTandirWorkers {
    firstWorker: number | null,
    secondWorker: number | null,
    thirdWorker: number | null,
}

export const dashboardUsersList = [UserRoles.ADMIN, UserRoles.HEADCOMPANY, UserRoles.GUEST, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.ZP];
export const workersUsersList = [UserRoles.DELIVERY, UserRoles.SELLER, UserRoles.HEADSECTION, UserRoles.TANDIR, UserRoles.KASSIR] 
export const adminAndHeadCompany = [UserRoles.ADMIN, UserRoles.HEADCOMPANY, UserRoles.GLBUX]
