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
    SUPPLIERS = 'SUPPLIERS'
}

export enum TypeTMZ {
    PRODUCT = 'PRODUCT',
    HALFSTUFF = 'HALFSTUFF',
    MATERIAL = 'MATERIAL',
}

export enum TypeSECTION {
    DELIVERY = 'DELIVERY',
    FILIAL = 'FILIAL',
    COMMON = 'COMMON',
    STORAGE = 'STORAGE',
    ACCOUNTANT = 'ACCOUNTANT',
    DIRECTOR = 'DIRECTOR',
    FOUNDER = 'FOUNDER',
}

export interface RefValues {
    clientForSectionId?: number
    typePartners?: TypePartners 
    typeTMZ?: TypeTMZ
    typeSection?: TypeSECTION
    unit?: string
    comment?: string
    markToDeleted?: boolean;
    norma?: number,
    un?: boolean
    longCharge?: boolean,
    shavkatCharge?: boolean,
    firstPrice?: number,
    secondPrice?: number
    thirdPrice?: number,
    telegramId?: string,
}

export interface ReferenceModel {
    id?: number,
    oldId: string,
    name: string
    typeReference: TypeReference
    refValues : RefValues
}





