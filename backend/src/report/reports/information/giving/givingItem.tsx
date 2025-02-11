
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';
import { queryKorFull } from 'src/report/helpers/querys/queryKorFull';

export const givingItem = ( 
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string, 
  globalEntrys: Array<EntryItem> | undefined ) => {    
  
    const glBuxId = '65d877b707d829e2595d11c0';
    const OBSUM50 = queryKorFull(Schet.S20, Schet.S50, TypeQuery.OS, startDate, endDate, '', String(currentSectionId), glBuxId, 'cash', globalEntrys)
    + queryKorFull(Schet.S60, Schet.S50, TypeQuery.OS, startDate, endDate, String(currentSectionId), '', glBuxId, 'cash', globalEntrys) 
    + queryKorFull(Schet.S50, Schet.S50, TypeQuery.OS, startDate, endDate, String(currentSectionId), '', glBuxId, 'cash', globalEntrys)
    + queryKorFull(Schet.S67, Schet.S50, TypeQuery.OS, startDate, endDate, String(currentSectionId), '', glBuxId, 'cash', globalEntrys) ;

    if (!OBSUM50) return {}
    return ( 
        {
        section: title,
        giving: OBSUM50
        }
    )
    
} 