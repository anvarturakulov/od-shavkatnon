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

    Order = 'Order',
    Error = 'Error'
}

export enum DocSTATUS {
    OPEN = 'OPEN',
    DELETED = 'DELETED',
    PROVEDEN = 'PROVEDEN'
}

export enum OrderStatus {
    OPEN = 'OPEN',
    DELETED = 'DELETED',
    COMPLETED = 'COMPLETED',
    EXPIRED = 'EXPIRED'
}

// export interface DocumentTableItem {
//     isWorker: boolean;
//     referenceId: string;
//     referenceName?: string;
//     count: number;
//     price: number;
//     total: number;
// }

// export class DocumentItem {
//     _id: string;
//     date: number;
//     docNumber: number;
//     documentType: DocumentType;
//     senderId: string;
//     receiverId: string;
//     tableItems?: DocumentTableItem[];
//     payValue?: number;
//     deleted?: boolean;
//     comment?: string;
// }

export interface SendingHamir {
    id: number,
    count: number,
    analiticId: number
}