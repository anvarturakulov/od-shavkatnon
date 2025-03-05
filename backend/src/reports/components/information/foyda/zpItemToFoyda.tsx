import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';


export const zpItemToFoyda = ( 
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  globalEntrys: Array<EntryItem> | undefined,
  ) => {
  
  let zp = 0;
  zp = queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  
  return zp
      
} 