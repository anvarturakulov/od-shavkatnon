
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';
import { queryKorFull } from 'src/report/helpers/querys/queryKorFull';

export const takingItem = ( 
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string, 
  globalEntrys: Array<EntryItem> | undefined ) => {    
  
    const glBuxId = '65d877b707d829e2595d11c0';
    const OBSUMK5050 = queryKorFull(Schet.S50, Schet.S50, TypeQuery.OS, startDate, endDate, glBuxId, 'cash', String(currentSectionId), '', globalEntrys);
    if (!OBSUMK5050) return {}
    return ( 
        {
        section: title,
        taking: OBSUMK5050
        }
    )
    
} 