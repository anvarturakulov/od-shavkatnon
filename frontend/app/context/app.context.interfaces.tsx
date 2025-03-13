import { DocumentModel, Interval, JournalCheckboxs } from '../interfaces/document.interface';
import { ContentType, MessageType } from '../interfaces/general.interface';
import { ReferenceModel } from '../interfaces/reference.interface';
import { EntryItem, ReportOptions } from '../interfaces/report.interface';
import { DefinedTandirWorkers, User, UserModel, UserName } from '../interfaces/user.interface';

export interface Maindata {
  document: {
    currentDocument: DocumentModel,
    definedTandirWorkers: DefinedTandirWorkers,
  },
  reference: {
    currentReference: ReferenceModel | undefined,
  },
  report: {
    reportOption: ReportOptions,
    loading: boolean,
    informData: Array<any>,
    matOborot: Array<any>,
    oborotka: any,
    personal: any,
    currentDKInnerReportId: number,
    currentDKInnerArrayId: number,
    dashboardCurrentReportType: string,
    currentFinancialInnerReportType: string,
  },
  journal: {
    updateDataForDocumentJournal: boolean,
    updateDataForUserJournal: boolean,
    journalChechboxs: JournalCheckboxs,
    updateDataForRefenceJournal: boolean,
    currentStorageIdInHamirsJournal: string,
    updateHamirJournal: boolean,
  },
  window: {
    showMessageWindow: boolean,
    message: string | Array<EntryItem>,
    messageType: MessageType,
    activeMenuKey: string,
    clearControlElements: boolean,
    showDocumentWindow: boolean,
    isNewDocument: boolean,
    showReferenceWindow: boolean,
    isNewReference: boolean;
    interval: Interval,
    showIntervalWindow: boolean,
    showMayda: boolean,
    contentType?: ContentType,
    contentName: string,
    contentTitle: string;
    mainPage: boolean,
    uploadingDashboard: boolean,
    showUserWindow: boolean,
    isNewUser: boolean,
  },
  users: {
    currentUser: UserModel | undefined,
    user: User | undefined,
    usersName: [UserName] | undefined
  }
  
}

export interface IAppContext {
  mainData: Maindata,
  setMainData? : (key: string, value: any) => void;
};