import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { DocumentType } from 'src/interfaces/document.interface';
import { Sequelize } from 'sequelize-typescript';
import { Document } from 'src/documents/document.model';
import { queryKor } from 'src/reports/querys/queryKor';
import { query } from 'src/reports/querys/query';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { Reference } from 'src/references/reference.model';
import { TypeReference, TypeTMZ } from 'src/interfaces/reference.interface';

export const sectionItem = async (
    data: any,
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

  let results:any[] = [];
  let filteredData:Reference[] = []

  if (0 && startDate != null && endDate != null) {
    maydaSavdoCountAll = 0;
  }

  if (startDate != null && endDate != null) {
    maydaSavdoCountBux = 0;
  }

  let maydaSavdoCount = maydaSavdoCountAll - maydaSavdoCountBux;
  let schetCash = sectionType == 'FOUNDER' ? Schet.S66 : Schet.S50;

  filteredData = data.filter((item: Reference) => {
    return (
      item?.refValues.typeTMZ == TypeTMZ.PRODUCT && !item.refValues.markToDeleted
    )
  })
  
  for (const item of filteredData) {
    const promises = [
      query(Schet.S28, TypeQuery.POKOL, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService), // POKOL
      query(Schet.S28, TypeQuery.KOKOL, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService), // KOKOL
      queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, currentSectionId, item.id, null, oborotsService), // OBKOLD2828
      queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, currentSectionId, item.id, null, oborotsService), // OBKOLD2820
      queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, item.id, null, oborotsService), // OBKOLK2828
      queryKor(Schet.S28, Schet.S60, TypeQuery.ODK, startDate, endDate, currentSectionId, item.id, null, oborotsService), // productionImportCol
      queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, item.id, null, oborotsService), // OBKOLK2028
      queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, item.id, null, oborotsService), // OBKOLK4028
      // query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TDKOL
      // query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TKKOL
    ];
  
    const [
      POKOL,
      KOKOL,
      OBKOLD2828,
      OBKOLD2820,
      OBKOLK2828,
      productionImportCol,
      OBKOLK2028,
      OBKOLK4028,
      
    ] = await Promise.all(promises);
    
    // const total: boolean = (!POKOL && !KOKOL && !OBKOLD2828 && !OBKOLD2820 && !productionImportCol && !OBKOLK2028 && !OBKOLK4028) 


    let element = {
      name: item.name,
      startBalansCountNon: POKOL,
      prodCountNon: OBKOLD2820,
      moveIncomeCountNon: OBKOLD2828 + productionImportCol,
      saleCountNon: OBKOLK4028,
      maydaSavdoCount,
      brakCountNon: OBKOLK2028,
      moveOutNon: OBKOLK2828,
      endBalansCountNon: KOKOL,
    }  
    
    if (Object.keys(element).length) {
        results.push(element)
    }
  }

  const promises = [
    query(schetCash, TypeQuery.POSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // POSUM
    query(schetCash, TypeQuery.KOSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // KOSUM (было POSUM, возможно ошибка)
    query(schetCash, TypeQuery.TDSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TDSUM
    query(schetCash, TypeQuery.TKSUM, startDate, endDate, currentSectionId, null, null, stocksService, oborotsService), // TKSUM
    queryKor(schetCash, schetCash, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, oborotsService), // MOVEINN
    queryKor(schetCash, schetCash, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, oborotsService), // MOVEOUT
  ];

  const [
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
    counts : [...results],
    startBalansSumma: POSUM,
    incomeFromSaleSumma: TDSUM - MOVEINN,
    incomeFromMoveSumma: MOVEINN,
    outFromMoveSumma: MOVEOUT,
    chargesSumma: TKSUM - MOVEOUT,
    endBalansSumma: KOSUM,
  };
};