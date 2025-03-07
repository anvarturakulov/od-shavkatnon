import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { DocumentType } from 'src/interfaces/document.interface';

export const sectionItem = ( 
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string,
  docs: Document[],
  sectionType: 'DELIVERY' | 'FILIAL' | 'BUXGALTER' | 'FOUNDER',
  globalEntrys: Array<EntryItem> | undefined ) => {

  let maydaSavdoCountAll = 0;
  let maydaSavdoCountBux = 0;
  const maydaSavdoReceiverId = '659d292d630ca82ec3dcae1c';
  let idForBuxanka = '678dc6a8d32db54479bf5d79';
  
  if (docs && docs.length > 0) {
    maydaSavdoCountAll = docs.filter((item: Document) => {
      return (
        item.date>= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.SaleProd &&
        String(item.senderId) == String(currentSectionId)  &&
        String(item.receiverId) == maydaSavdoReceiverId
      )
    }).reduce((total, item:Document) => total + item.count, 0)
  }

  if (docs && docs.length > 0) {
    maydaSavdoCountBux = docs.filter((item: Document) => {
      return (
        item.date>= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.SaleProd &&
        String(item.senderId) == String(currentSectionId)  &&
        String(item.analiticId) == idForBuxanka &&
        String(item.receiverId) == maydaSavdoReceiverId
      )
    }).reduce((total, item:Document) => total + item.count, 0)
  }
  let maydaSavdoCount = maydaSavdoCountAll - maydaSavdoCountBux

  let schetCash = sectionType == 'FOUNDER' ? Schet.S68 : Schet.S50

  const PDKOL = query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, '', globalEntrys);
  const PDKOLbux = query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);
  
  const PKKOL = query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, '', globalEntrys);
  const PKKOLbux = query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);

  const OBKOLD2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const OBKOLD2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
  
  const OBKOLD2820 = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const OBKOLD2820bux = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);;
  
  const OBKOLK2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const OBKOLK2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
  
  const productionImportCol = queryKor(Schet.S28, Schet.S60, TypeQuery.ODK, startDate, endDate, String(currentSectionId), '', globalEntrys);

  const OBKOLK2028 = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);;
  const OBKOLK2028bux = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);

  const OBKOLK4028 = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const OBKOLK4028bux = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
  
  const TDKOL = query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, '', globalEntrys);
  const TDKOLbux = query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);
  
  const TKKOL = query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, '', globalEntrys);
  const TKKOLbux = query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys);

  const PDSUM = query(schetCash, TypeQuery.PDSUM, startDate, endDate, currentSectionId, '', globalEntrys);
  const PKSUM = query(schetCash, TypeQuery.PKSUM, startDate, endDate, currentSectionId, '', globalEntrys);

  const TDSUM = query(schetCash, TypeQuery.TDSUM, startDate, endDate, currentSectionId, '', globalEntrys);
  const TKSUM = query(schetCash, TypeQuery.TKSUM, startDate, endDate, currentSectionId, '', globalEntrys);

  const MOVEINN = queryKor(schetCash, schetCash, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const MOVEOUT = queryKor(schetCash, schetCash, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);

  
  return (
    {
      section: title,
      sectionId: currentSectionId,
      startBalansCountNon: PDKOL-PKKOL-(PDKOLbux-PKKOLbux),
      startBalansCountBux: PDKOLbux-PKKOLbux,
      prodCountNon: OBKOLD2820-OBKOLD2820bux,
      prodCountBux: OBKOLD2820bux,
      moveIncomeCountNon: OBKOLD2828-OBKOLD2828bux+productionImportCol,
      moveIncomeCountBux: OBKOLD2828bux,
      saleCountNon: OBKOLK4028-OBKOLK4028bux,
      saleCountBux: OBKOLK4028bux,
      maydaSavdoCount,
      maydaSavdoCountBux,
      brakCountNon: OBKOLK2028-OBKOLK2028bux,
      brakCountBux: OBKOLK2028bux,
      moveOutNon: OBKOLK2828-OBKOLK2828bux,
      moveOutBux: OBKOLK2828bux,
      endBalansCountNon: PDKOL - PKKOL + TDKOL - TKKOL - (PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux),
      endBalansCountBux: PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux, 
      startBalansSumma: PDSUM-PKSUM,
      incomeFromSaleSumma: TDSUM-MOVEINN,
      incomeFromMoveSumma: MOVEINN,
      outFromMoveSumma: MOVEOUT,
      chargesSumma: TKSUM-MOVEOUT,
      endBalansSumma: PDSUM-PKSUM+TDSUM-TKSUM
    }
      
  )
} 