import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { DocumentType } from 'src/interfaces/document.interface';
import { Sequelize } from 'sequelize-typescript';
import { Document } from 'src/documents/document.model';
import { queryKor } from 'src/reports/querys/queryKor';
import { query } from 'src/reports/querys/query';

export const sectionItem = async ( 
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  title: string,
  docs: Document[],
  sectionType: 'DELIVERY' | 'FILIAL' | 'BUXGALTER' | 'FOUNDER',
  sequelize: Sequelize ) => {

  let maydaSavdoCountAll = 0;
  let maydaSavdoCountBux = 0;
  const maydaSavdoReceiverId = -1;
  let idForBuxanka = -1;
  // Shu erda hato bor
  
  if (docs && docs.length > 0 && startDate != null && endDate != null) {
    maydaSavdoCountAll = docs.filter((item: Document) => {
      return (
        item.date>= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.SaleProd &&
        item.docValues.senderId == currentSectionId  &&
        item.docValues.receiverId == maydaSavdoReceiverId
      )
    }).reduce((total, item:Document) => total + item.docValues.count, 0)
  }

  if (docs && docs.length > 0 && startDate != null && endDate != null) {
    maydaSavdoCountBux = docs.filter((item: Document) => {
      return (
        item.date>= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.SaleProd &&
        item.docValues.senderId == currentSectionId  &&
        item.docValues.analiticId == idForBuxanka &&
        item.docValues.receiverId == maydaSavdoReceiverId
      )
    }).reduce((total, item:Document) => total + item.docValues.count, 0)
  }
  let maydaSavdoCount = maydaSavdoCountAll - maydaSavdoCountBux

  let schetCash = sectionType == 'FOUNDER' ? Schet.S68 : Schet.S50

  const PDKOL = await query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, null, null, sequelize);
  const PDKOLbux = await query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const PKKOL = await query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, null, null, sequelize);
  const PKKOLbux = await query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);

  const OBKOLD2828 = await queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, currentSectionId, null, null, sequelize);
  const OBKOLD2828bux = await queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const OBKOLD2820 = await queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, currentSectionId, null, null, sequelize);
  const OBKOLD2820bux = await queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);;
  
  const OBKOLK2828 = await queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, sequelize);
  const OBKOLK2828bux = await queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const productionImportCol = await queryKor(Schet.S28, Schet.S60, TypeQuery.ODK, startDate, endDate, currentSectionId, null, null, sequelize);

  const OBKOLK2028 = await queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, sequelize);
  const OBKOLK2028bux = await queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);

  const OBKOLK4028 = await queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, sequelize);
  const OBKOLK4028bux = await queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const TDKOL = await query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, null, null, sequelize);
  const TDKOLbux = await query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const TKKOL = await query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, null, null, sequelize);
  const TKKOLbux = await query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);

  const PDSUM = await query(schetCash, TypeQuery.PDSUM, startDate, endDate, currentSectionId, null, null, sequelize);
  const PKSUM = await query(schetCash, TypeQuery.PKSUM, startDate, endDate, currentSectionId, null, null, sequelize);

  const TDSUM = await query(schetCash, TypeQuery.TDSUM, startDate, endDate, currentSectionId, null, null, sequelize);
  const TKSUM = await query(schetCash, TypeQuery.TKSUM, startDate, endDate, currentSectionId, null, null, sequelize);

  const MOVEINN = await queryKor(schetCash, schetCash, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);
  const MOVEOUT = await queryKor(schetCash, schetCash, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);

  
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