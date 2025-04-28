import { TypeReference } from './reference.interface'

export enum DocSTATUS {
    OPEN = 'OPEN',
    DELETED = 'DELETED',
    PROVEDEN = 'PROVEDEN'
}

export enum DocumentType {

    ComeMaterial = 'ComeMaterial',
    ComeProduct = 'ComeProduct',
    ComeHalfstuff = 'ComeHalfstuff',
    ComeProductImport = 'ComeProductImport',

    SaleProd = 'SaleProd',
    SaleMaterial = 'SaleMaterial',
    SaleHalfStuff = 'SaleHalfStuff',

    LeaveProd = 'LeaveProd',
    LeaveMaterial = 'LeaveMaterial',
    LeaveHalfstuff = 'LeaveHalfstuff',

    MoveProd = 'MoveProd',
    MoveMaterial = 'MoveMaterial',
    MoveHalfstuff = 'MoveHalfstuff',

    ComeCashFromPartners = 'ComeCashFromPartners',
    MoveCash = 'MoveCash',
    LeaveCash = 'LeaveCash',
    ZpCalculate = 'ZpCalculate',
    TakeProfit = 'TakeProfit',

    ServicesFromPartners = 'ServicesFromPartners',

    Error = 'Error'
}

export interface DocTableItem {
    analiticId: number,
    balance: number,
    count: number,
    price: number,
    total: number,
    comment: string,
}

export interface DocValues {
    senderId: number,
    senderoldId?: string;
    receiverId: number,
    receiverOldId?: string;
    analiticId?: number,
    analiticOldId?: string;
    productForChargeId?: number,
    isWorker?: boolean,
    isPartner?: boolean,
    isFounder?: boolean,
    isCash?: boolean,
    count: number,
    balance?: number,
    price: number,
    total: number,
    cashFromPartner?: number,
    comment?: string,
}

export interface DocumentModel {
    id?: number,
    date: number,
    userId: number,
    userOldId?: string,
    documentType: string,
    docStatus: DocSTATUS,
    docValues: DocValues
    docTableItems: Array<DocTableItem>,
};

export interface OptionsForDocument {
    senderType: TypeReference,
    senderLabel: string,
    senderIsVisible: boolean,

    receiverType: TypeReference,
    receiverLabel: string,
    recieverIsVisible: boolean

    analiticType: TypeReference,
    analiticLabel: string,
    analiticIsVisible: boolean

    productForChargeType: TypeReference,
    productForChargeLabel: string,
    productForChargeIsVisible: boolean

    cashFromPartnerLabel: string,
    cashFromPartnerVisible: boolean,

    tableIsVisible: boolean,
    countIsVisible: boolean,
    priceIsVisible: boolean,
    totalIsVisible: boolean,
    priceIsDisabled: boolean,
    totalIsDisabled: boolean,
    balansIsVisible: boolean,
}

export type DocumentTypeForReference = 'MATERIAL' | 'PRODUCT' | 'HALFSTUFF' | 'OTHER'

export interface Interval {
    dateStart: number,
    dateEnd: number
}

export interface DatesForDuplicateDocs {
    dateFrom: number,
    dateTo: number
}

export type NameControl = 'count' | 'price' | 'total' | 'comment' | 'cashFromPartner' | 'balance'

export type NameDocs = 'sd' | 'ds'

export interface JournalCheckboxs {
    charges: boolean,
    workers: boolean,
    partners: boolean,
}