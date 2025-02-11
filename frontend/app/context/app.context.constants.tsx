import { DocumentModel, DocumentType, Interval, JournalCheckboxs } from '../interfaces/document.interface'
import { DefinedTandirWorkers } from '../interfaces/general.interface'
import { ReportOptions, Schet } from '../interfaces/report.interface'
import { Maindata } from './app.context.interfaces'

export const defaultDocumentTableItem = {
    referenceId: '',
    count: 0,
    price: 0,
    total: 0,
    comment: '',
    balance: 0
}

export const defaultDocumentFormItems:DocumentModel = {
    _id: '',
    date: 0,
    docNumber: 0,
    documentType: '',
    deleted: false,
    user: '',
    senderId: '',
    receiverId: '',
    analiticId: '',
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
    proveden: true,
    firstWorkerId: '',
    secondWorkerId: '',
    thirdWorkerId: '',
    tableItems: [defaultDocumentTableItem],
    // мы его не используем
}

export const defaultTandirWorkers: DefinedTandirWorkers = {
    firstWorker: '',
    secondWorker: '',
    thirdWorker: '',
}

export const defaultReportOptions: ReportOptions =  {
    startDate: 1708905600000,
    endDate: 1708905600000,
    firstReferenceId: '',
    secondReferenceId: '',
    showReport: false,
    entrys: [],
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
    activeMenuKey: '',
    contentType: 'document',
    contentName: '',
    contentTitle: '',
    user: undefined,
    mainPage: true,
    showMessageWindow: false,
    message: 'Маълумотлар сакланди',
    messageType: 'error',
    showDocumentWindow: false,
    isNewDocument: false,
    updateDataForDocumentJournal: false,
    currentDocument: {...defaultDocumentFormItems},
    clearControlElements: false,
    showReferenceWindow: false,
    isNewReference: false,
    updateDataForRefenceJournal: false,
    currentReference: undefined,
    reportOption: {...defaultReportOptions},
    showIntervalWindow: false,
    showMayda: false,
    definedTandirWorkers: defaultTandirWorkers,
    updateHamirJournal: false,
    currentStorageIdInHamirsJournal: '',
    interval: defaultInterval,
    loading: false,
    informData: [],
    matOborot: [],
    oborotka: [],
    journalChechboxs: defaultJournalCheckbox,
    showUserWindow: false,
    isNewUser: false,
    currentUser: undefined,
    updateDataForUserJournal: false,
    currentFinancialInnerReportType: 'outZP',
    dashboardCurrentReportType: '',
    currentDKInnerReportId: '',
    currentDKInnerArrayId: '',
    uploadingDashboard: false,
  }