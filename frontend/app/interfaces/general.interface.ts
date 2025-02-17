export type ContentType = 'document' | 'reference' | 'servis' | 'report'

export interface DashboardSettings {
    mainPage: boolean,
    activeMenuKey: string,
    activeMenuTitle: string,
    activeMenuType: ContentType,
    userId: string
}

export enum ServiceType {
    Users = 'Фойдаланувчилар',
    Options = 'Дастур хусусиятлари',
    DeleteDocs = 'Хужжатларни учириш',
}

export type MessageType = 'success' | 'error' | 'warm'

export enum UserRoles {
    ADMIN = 'ADMIN',
    HEADCOMPANY = 'HEADCOMPANY',
    GLBUX = 'GLBUX',
    ZAMGLBUX = 'ZAMGLBUX',
    ELAKCHI = 'ELAKCHI',
    HAMIRCHI = 'HAMIRCHI',
    TANDIR = 'TANDIR',
    HEADSECTION = 'HEADSECTION',
    DELIVERY = 'DELIVERY',
    SELLER = 'SELLER',
    GUEST = 'GUEST',
    ZP = 'ZP',
    KASSIR = 'KASSIR'
}

export interface User {
    email: string,
    access_token: string;
    role: UserRoles,
    name: string,
    storageId: string,
    tandirId: string,
    productId: string 
}

export interface BodyForLogin {
    login: string,
    password: string,
}

export interface DefinedTandirWorkers {
    firstWorker: number | null,
    secondWorker: number | null,
    thirdWorker: number | null,
}

export const dashboardUsersList = [UserRoles.ADMIN, UserRoles.HEADCOMPANY, UserRoles.GUEST, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.ZP];
export const workersUsersList = [UserRoles.DELIVERY, UserRoles.SELLER, UserRoles.ELAKCHI, UserRoles.HAMIRCHI, UserRoles.HEADSECTION, UserRoles.TANDIR, UserRoles.KASSIR] 
export const adminAndHeadCompany = [UserRoles.ADMIN, UserRoles.HEADCOMPANY, UserRoles.GLBUX]