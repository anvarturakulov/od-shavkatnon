import { DocumentModel, Interval, JournalCheckboxs } from '../interfaces/document.interface';
import { ContentType, MessageType, DefinedTandirWorkers, User } from '../interfaces/general.interface';
import { ReferenceModel } from '../interfaces/reference.interface';
import { EntryItem, ReportOptions } from '../interfaces/report.interface';
import { UserModel } from '../interfaces/user.interface';

export interface Maindata {
  activeMenuKey: string,
  contentType?: ContentType,
  contentName: string,
  contentTitle: string;
  user: User | undefined,
  mainPage: boolean,
  showMessageWindow: boolean,
  message: string | Array<EntryItem>,
  messageType: MessageType,
  showDocumentWindow: boolean,
  isNewDocument: boolean,
  currentDocument: DocumentModel,
  updateDataForDocumentJournal: boolean,
  clearControlElements: boolean,
  showReferenceWindow: boolean,
  isNewReference: boolean;
  updateDataForRefenceJournal: boolean,
  currentReference: ReferenceModel | undefined,
  reportOption: ReportOptions,
  showIntervalWindow: boolean,
  showMayda: boolean,
  definedTandirWorkers: DefinedTandirWorkers,
  updateHamirJournal: boolean,
  currentStorageIdInHamirsJournal: string,
  interval: Interval,
  loading: boolean,
  informData: Array<any>,
  matOborot: Array<any>,
  oborotka: any,
  journalChechboxs: JournalCheckboxs,
  showUserWindow: boolean,
  isNewUser: boolean,
  currentUser: UserModel | undefined,
  updateDataForUserJournal: boolean,
  currentFinancialInnerReportType: string,
  dashboardCurrentReportType: string,
  currentDKInnerReportId: string,
  currentDKInnerArrayId: string,
  uploadingDashboard: boolean,
}

export interface IAppContext {
  mainData: Maindata,
  setMainData? : (key: string, value: any) => void;
};