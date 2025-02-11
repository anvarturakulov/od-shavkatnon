import { DocumentType } from './document.interface';

export enum ReportType {
    MatOborot = 'MatOborot',
    Oborotka = 'Oborotka',
    Personal = 'Personal',
    AktSverka = 'AktSverka',
}

export enum Schet{
    S00 = 'S00', // СЧЕТА ДЛЯ ВВОДА ОСТАТКОВ И ЗАКРЫТИЯ ЗП
    S10 = 'S10', // СЧЕТА УЧЕТА МАТЕРИАЛОВ
    S20 = 'S20', // СЧЕТА УЧЕТА ОСНОВНОГО ПРОИЗВОДСТВА И СЧЕТА УЧЕТА РАСХОДОВ ПЕРИОДА
    S21 = 'S21', // СЧЕТА УЧЕТА ПОЛУФАБРИКАТОВ СОБСТВЕННОГО ПРОИЗВОДСТВА
    S23 = 'S23', // СЧЕТ УЧЕТА ВСПОМОГАТЕЛЬНОГО ПРОИЗВОДСТВА
    S28 = 'S28', // СЧЕТА УЧЕТА ГОТОВОЙ ПРОДУКЦИИ
    S29 = 'S29', // СЧЕТА УЧЕТА ТОВАРОВ 
    S40 = 'S40', // СЧЕТА К ПОЛУЧЕНИЮ 
    S50 = 'S50', // СЧЕТА УЧЕТА ДЕНЕЖНЫХ СРЕДСТВ В КАССЕ
    S51 = 'S51', // СЧЕТА УЧЕТА ДЕНЕЖНЫХ СРЕДСТВ НА РАСЧЕТНОМ СЧЕТЕ
    S60 = 'S60', // СЧЕТА К ОПЛАТЕ ПОСТАВЩИКАМ И ПОДРЯДЧИКАМ
    S66 = 'S66', // СЧЕТА УЧЕТА ЗАРОБОТНОЙ ПЛАТЫ СОТРУДНИКОВ
    S67 = 'S67', // СЧЕТА УЧЕТА ЗАРОБОТНОЙ ПЛАТЫ СОТРУДНИКОВ
    S68 = 'S68', // КОШЕЛЕК УЧРИДИТЕЛЕЙ
}

export interface EntryItem {
    date: number,
    docNumber: number,
    docId: string,
    documentType: DocumentType,
    debet: Schet,
    debetFirstSubcontoId: string,
    debetSecondSubcontoId: string,
    kredit: Schet,
    kreditFirstSubcontoId: string,
    kreditSecondSubcontoId: string,
    count: number,
    summa: number,
    comment: string,
}

export enum DEBETKREDIT {
    DEBET = 'DEBET',
    KREDIT = 'KREDIT'
}

export enum TypeQuery {
    PDSUM = 'PDSUM',
    PDKOL = 'PDKOL',
    PKSUM = 'PKSUM',
    PKKOL = 'PKKOL',
    TDSUM = 'TDSUM',
    TDKOL = 'TDKOL',
    TKSUM = 'TKSUM',
    TKKOL = 'TKKOL',
    MPRICE = 'MPRICE',
    BALANCE = 'BALANCE',
    TDSUMEntrys = 'TDSUMEntrys',
    TKSUMEntrys = 'TKSUMEntrys',
    AllEntrys = 'AllEntrys',
    ODS = 'ODS',
    OKS = 'OKS',
    ODK = 'ODK',
    OKK = 'OKK',
    OK = 'OK',
    OS = 'OS'
}

export interface QueryObject {
    typeQuery?: string, 
    schet: string,
    startDate?: number, 
    endDate: number, 
    firstSubcontoId: string | undefined, 
    secondSubcontoId: string | undefined,
}

export interface QueryInformation {
    startDate: number,
    endDate: number,
    reportType: string,
    foydaPrice: FoydaPrice, 
}

export interface QueryMatOtchet {
    startDate: number,
    endDate: number,
    section: string,
}

export interface QueryOborotka {
    startDate: number,
    endDate: number,
    schet: string,
}

export interface QueryAnalitic {
    startDate: number,
    endDate: number,
    schet: string,
    firstSubcontoId: string,
    secondSubcontoId: string,
    dk: string,
}

export interface QueryWorker {
    startDate: number,
    endDate: number,
    workerId: string,
    name: string
}

export interface FoydaPrice {
    first: number,
    second: number
}