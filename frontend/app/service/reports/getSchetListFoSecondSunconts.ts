import { OborotType, ReportType, Schet } from '@/app/interfaces/report.interface'

export const getSchetListFoSecondSunconts = (contentName: string, schet: Schet): Array<Schet> => {
  switch (contentName) {
    case ReportType.Personal:
      return [Schet.S67]
    case ReportType.MatOborot:
      return [Schet.S10, Schet.S21, Schet.S28]
    case ReportType.Oborotka:
      switch (schet){
        case Schet.S20 : return [Schet.S20];
        case Schet.S50: return [Schet.S50];
        default: return [Schet.S00];
      }
    default:
      return [Schet.S00]
  }
}