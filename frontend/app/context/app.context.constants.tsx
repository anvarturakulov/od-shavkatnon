import { DocSTATUS, DocTableItem, DocumentModel, DocumentType, DocValue, Interval, JournalCheckboxs } from '../interfaces/document.interface'
import { DefinedTandirWorkers } from '../interfaces/general.interface'
import { ReportOptions, Schet } from '../interfaces/report.interface'
import { Maindata } from './app.context.interfaces'

export const defaultDocumentTableItem: DocTableItem = {
    referenceId: 0,
    balance: 0,
    count: 0,
    price: 0,
    total: 0,
    comment: ''
}

export const defaultDocValue: DocValue = {
    senderId: 0,
    senderoldId: '',
    receiverId: 0,
    receiverOldId: '',
    analiticId: 0,
    analiticOldId: '',
    isWorker: false,
    isPartner: false,
    isFounder: false,
    isCash: false,
    count: 0,
    balance: 0,
    price: 0,
    total: 0,
    cashFromPartner: 0,
    comment: '',
    firstWorkerId: 0,
    secondWorkerId: 0,
    thirdWorkerId: 0,
}

export const defaultDocument:DocumentModel = {
    id: -1,
    date: 0,
    documentType: '',
    userId: 0,
    userOldId: '',
    docStatus: DocSTATUS.OPEN,
    docValue: defaultDocValue,
    docTableItems: [defaultDocumentTableItem],
}

export const defaultTandirWorkers: DefinedTandirWorkers = {
    firstWorker: 0,
    secondWorker: 0,
    thirdWorker: 0,
}

export const defaultReportOptions: ReportOptions =  {
    startDate: 1708905600000,
    endDate: 1708905600000,
    firstReferenceId: '',
    secondReferenceId: '',
    showReport: false,
    startReport: false,
    schet: Schet.S20,
}

export const defaultInterval:Interval = {
    dateStart: 0,
    dateEnd: 0
}

export const defaultJournalCheckbox:JournalCheckboxs = {
    charges: false,
    workers: false,
    partners: false
}

export const defaultMainData: Maindata = {
    document: {
        currentDocument: {...defaultDocument},
        definedTandirWorkers: defaultTandirWorkers,
    },
    reference: {
        currentReference: undefined,
    },
    report: {
        reportOption: {...defaultReportOptions},
        loading: false,
        informData: [],
        matOborot: [],
        oborotka: [],
        currentDKInnerReportId: '',
        currentDKInnerArrayId: '',
        dashboardCurrentReportType: '',
        currentFinancialInnerReportType: 'outZP',
    },
    journal: {
        updateDataForDocumentJournal: false,
        updateDataForUserJournal: false,
        journalChechboxs: defaultJournalCheckbox,
        updateDataForRefenceJournal: false,
        currentStorageIdInHamirsJournal: '',
        updateHamirJournal: false,
    },
    window: {
        showMessageWindow: false,
        message: 'Маълумотлар сакланди',
        messageType: 'error',
        clearControlElements: false,
        showDocumentWindow: false,
        isNewDocument: false,
        showReferenceWindow: false,
        isNewReference: false,
        interval: defaultInterval,
        showIntervalWindow: false,
        showMayda: false,
        contentType: 'document',
        contentName: '',
        contentTitle: '',
        activeMenuKey: '',
        mainPage: true,
        showUserWindow: false,
        isNewUser: false,
        uploadingDashboard: false,
    },
    users: {
        user: undefined,
        currentUser: undefined,
    }
    
  }