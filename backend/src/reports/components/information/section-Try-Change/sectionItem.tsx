import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { DocumentType } from 'src/interfaces/document.interface';
import { Sequelize } from 'sequelize-typescript';
import { Document } from 'src/documents/document.model';
import { queryKor } from 'src/reports/querys/queryKor';
import { query } from 'src/reports/querys/query';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

export const sectionItem = async ( 
    startDate: number | null,
    endDate: number | null,
    currentSectionId: number, 
    title: string,
    sectionType: 'DELIVERY' | 'FILIAL' | 'BUXGALTER' | 'FOUNDER',
    stocksService: StocksService,
    oborotsService: OborotsService
  ) => {
  
  let maydaSavdoCountAll = 0;
  let maydaSavdoCountBux = 0;
  const maydaSavdoReceiverId = -1;
  let idForBuxanka = -1;

  if (0 && startDate != null && endDate != null) {
    maydaSavdoCountAll = 0;
  }

  if (startDate != null && endDate != null) {
    maydaSavdoCountBux = 0;
  }

  // const maydaSavdoCountAllPromise = stocksService.querySomeData(/* параметры */);
  // const maydaSavdoCountBuxPromise = stocksService.querySomeData(/* параметры */);

  let maydaSavdoCount = maydaSavdoCountAll - maydaSavdoCountBux;

  let schetCash = sectionType == 'FOUNDER' ? Schet.S68 : Schet.S50;

  const promises = [
    query(Schet.S28, TypeQuery.POKOL, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // POKOL
    query(Schet.S28, TypeQuery.POKOL, startDate, endDate, currentSectionId, idForBuxanka, null, stocksService, oborotsService), // POKOLbux
    query(Schet.S28, TypeQuery.KOKOL, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // KOKOL
    query(Schet.S28, TypeQuery.KOKOL, startDate, endDate, currentSectionId, idForBuxanka, null, stocksService, oborotsService), // KOKOLbux
    queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, currentSectionId, null, null, oborotsService), // OBKOLD2828
    queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, currentSectionId, idForBuxanka, null, oborotsService), // OBKOLD2828bux
    queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, currentSectionId, null, null, oborotsService), // OBKOLD2820
    queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, currentSectionId, idForBuxanka, null, oborotsService), // OBKOLD2820bux
    queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, oborotsService), // OBKOLK2828
    queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, oborotsService), // OBKOLK2828bux
    queryKor(Schet.S28, Schet.S60, TypeQuery.ODK, startDate, endDate, currentSectionId, null, null, oborotsService), // productionImportCol
    queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, oborotsService), // OBKOLK2028
    queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, oborotsService), // OBKOLK2028bux
    queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, oborotsService), // OBKOLK4028
    queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, oborotsService), // OBKOLK4028bux
    query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TDKOL
    query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, idForBuxanka, null, stocksService, oborotsService), // TDKOLbux
    query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TKKOL
    query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, idForBuxanka, null, stocksService, oborotsService), // TKKOLbux
    query(schetCash, TypeQuery.POSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // POSUM
    query(schetCash, TypeQuery.POSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // KOSUM (было POSUM, возможно ошибка)
    query(schetCash, TypeQuery.TDSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TDSUM
    query(schetCash, TypeQuery.TKSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TKSUM
    queryKor(schetCash, schetCash, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, oborotsService), // MOVEINN
    queryKor(schetCash, schetCash, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, oborotsService), // MOVEOUT
  ];

  const [
    POKOL,
    POKOLbux,
    KOKOL,
    KOKOLbux,
    OBKOLD2828,
    OBKOLD2828bux,
    OBKOLD2820,
    OBKOLD2820bux,
    OBKOLK2828,
    OBKOLK2828bux,
    productionImportCol,
    OBKOLK2028,
    OBKOLK2028bux,
    OBKOLK4028,
    OBKOLK4028bux,
    TDKOL,
    TDKOLbux,
    TKKOL,
    TKKOLbux,
    POSUM,
    KOSUM,
    TDSUM,
    TKSUM,
    MOVEINN,
    MOVEOUT,
  ] = await Promise.all(promises);

  return {
    section: title,
    sectionId: currentSectionId,
    startBalansCountNon: POKOL - POKOLbux,
    startBalansCountBux: POKOLbux,
    prodCountNon: OBKOLD2820 - OBKOLD2820bux,
    prodCountBux: OBKOLD2820bux,
    moveIncomeCountNon: OBKOLD2828 - OBKOLD2828bux + productionImportCol,
    moveIncomeCountBux: OBKOLD2828bux,
    saleCountNon: OBKOLK4028 - OBKOLK4028bux,
    saleCountBux: OBKOLK4028bux,
    maydaSavdoCount,
    maydaSavdoCountBux,
    brakCountNon: OBKOLK2028 - OBKOLK2028bux,
    brakCountBux: OBKOLK2028bux,
    moveOutNon: OBKOLK2828 - OBKOLK2828bux,
    moveOutBux: OBKOLK2828bux,
    endBalansCountNon: KOKOL - KOKOLbux,
    endBalansCountBux: KOKOLbux, 
    startBalansSumma: POSUM,
    incomeFromSaleSumma: TDSUM - MOVEINN,
    incomeFromMoveSumma: MOVEINN,
    outFromMoveSumma: MOVEOUT,
    chargesSumma: TKSUM - MOVEOUT,
    endBalansSumma: KOSUM,
  };
};