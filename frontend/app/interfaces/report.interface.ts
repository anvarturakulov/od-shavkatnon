import { UserRoles } from "./general.interface";

export enum ReportType {
    MatOborot = 'MatOborot',
    Personal = 'Personal',
    Oborotka = 'Oborotka',
}

export interface ReportOptions {
    startDate: number,
    endDate: number,
    firstReferenceId: string,
    secondReferenceId?: string,
    showReport: boolean,
    startReport: boolean,
    schet: Schet,
}

export enum Schet {
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


export enum OborotType {
    S20 = 'Харажатлар', // СЧЕТА УЧЕТА ОСНОВНОГО ПРОИЗВОДСТВА И СЧЕТА УЧЕТА РАСХОДОВ ПЕРИОДА
    S60 = 'Хамкорлар', // СЧЕТА К ПОЛУЧЕНИЮ И СЧЕТА К ОПЛАТЕ ПОСТАВЩИКАМ И ПОДРЯДЧИКАМ
    S50 = 'Касса', // СЧЕТА УЧЕТА ДЕНЕЖНЫХ СРЕДСТВ В КАССЕ
    S67 = 'Ходимлар иш хакиси'
} 

export interface DashboardReportItem {
    title: string,
    code: string,
    roles: Array<UserRoles>
}
