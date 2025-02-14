export enum TypeReference {
    CHARGES = 'CHARGES',
    PARTNERS = 'PARTNERS',
    PRICES = 'PRICES',
    STORAGES = 'STORAGES',
    TMZ = 'TMZ',
    WORKERS = 'WORKERS'
}

export enum TypePartners {
    CLIENTS = 'CLIENTS',
    SUPPLIERS = 'SUPPLIERS',
}

export enum TypeTMZ {
    MATERIAL = 'MATERIAL',
    PRODUCT = 'PRODUCT',
    HALFSTUFF = 'HALFSTUFF'
}

export enum TypeSECTION {
    DELIVERY = 'DELIVERY',
    FILIAL = 'FILIAL',
    COMMON = 'COMMON',
    STORAGE = 'STORAGE',
    ACCOUNTANT = 'ACCOUNTANT',
    DIRECTOR = 'DIRECTOR',
    FOUNDER = 'FOUNDER'
}

export interface ReferenceModel {
    _id?: string
    name: string
    typeReference: TypeReference
    typePartners?: TypePartners | undefined
    typeTMZ?: TypeTMZ | undefined
    unit?: string
    comment?: string
    deleted?: boolean
    delivery?: boolean
    filial?: boolean
    umumBulim?: boolean
    sklad?: boolean
    buxgalter?: boolean
    un?: boolean
    clientForDeliveryId?: string
    firstPrice?: number,
    secondPrice?: number
    thirdPrice?: number,
    telegramId?: string,
    norma?: number,
    longCharge?: boolean,
}