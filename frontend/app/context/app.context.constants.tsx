import { DocSTATUS, DocTableItem, DocumentModel, DocumentType, DocValues, Interval, JournalCheckboxs } from '../interfaces/document.interface'
import { ReportOptions, Schet } from '../interfaces/report.interface'
import { DefinedTandirWorkers } from '../interfaces/user.interface'
import { Maindata } from './app.context.interfaces'

export const defaultDocumentTableItem: DocTableItem = {
    analiticId: -1,
    balance: 0,
    count: 0,
    price: 0,
    total: 0,
    comment: ''
}

export const defaultDocValue: DocValues = {
    senderId: 0,
    receiverId: 0,
    // analiticId: 0,
    senderoldId: '',
    receiverOldId: '',
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
}

export const defaultDocument:DocumentModel = {
    id: -1,
    date: 0,
    documentType: '',
    userId: 0,
    userOldId: '',
    docStatus: DocSTATUS.OPEN,
    docValues: {...defaultDocValue},
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
        personal: [],
        currentDKInnerReportId: -1,
        currentDKInnerArrayId: -1,
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
        usersName: undefined
    }
    
  }