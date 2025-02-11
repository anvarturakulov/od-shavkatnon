import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';
import { query } from 'src/report/helpers/querys/query';

export const cashItem = ( 
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string, 
  globalEntrys: Array<EntryItem> | undefined ) => {

  
  const PDSUM = query( Schet.S50, TypeQuery.PDSUM, startDate, endDate, currentSectionId, '', globalEntrys);
  const PKSUM = query( Schet.S50, TypeQuery.PKSUM, startDate, endDate, currentSectionId, '', globalEntrys);
  const TRADEINCOME = queryKor(Schet.S50, Schet.S40, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const MOVEINCOME = queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const MOVEOUT = queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const CHARGES = 
    queryKor(Schet.S20, Schet.S50, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys) + 
    queryKor(Schet.S67, Schet.S50, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  
  const FORPARTNERS = queryKor(Schet.S60, Schet.S50, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const FORFOUNDER = queryKor(Schet.S66, Schet.S50, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const TDSUM = query( Schet.S50, TypeQuery.TDSUM,  startDate, endDate, currentSectionId, '', globalEntrys);
  const TKSUM = query( Schet.S50, TypeQuery.TKSUM, startDate, endDate, currentSectionId, '', globalEntrys);

  if ( !(PDSUM-PKSUM) && !(TRADEINCOME+MOVEINCOME) && !(CHARGES+FORPARTNERS+MOVEOUT+FORFOUNDER) 
      && !(PDSUM-PKSUM+TDSUM-TKSUM)) return {}
  return (
    {
      section: title,
      startBalans: PDSUM-PKSUM,
      sale: TRADEINCOME,
      moveIncome: MOVEINCOME,
      allIncome: TRADEINCOME+MOVEINCOME,
      charges: CHARGES,
      forPartner: FORPARTNERS,
      moveOut: MOVEOUT,
      forFounder: FORFOUNDER,
      allOut: CHARGES+ FORPARTNERS+MOVEOUT+FORFOUNDER,
      endBalans: PDSUM-PKSUM+TDSUM-TKSUM
    }
      
  )
} 