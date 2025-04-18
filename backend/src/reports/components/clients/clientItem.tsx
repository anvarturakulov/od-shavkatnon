import { Sequelize } from 'sequelize-typescript';
import { TypeTMZ } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { Reference } from 'src/references/reference.model';
import { query } from 'src/reports/querys/query';
import { StocksService } from 'src/stocks/stocks.service';

const prepareResult = async (data: any[], startDate, endDate, currentSectionId, schet, typeTMZ: TypeTMZ, stocksService: StocksService, oborotsService: OborotsService) => {
  let result: any[] = [];
  let filteredData: Reference[] = [];

  if (data && data.length) {
    filteredData = data.filter((item: Reference) => item?.refValues.typeTMZ == typeTMZ);
  }
  
  for (const item of filteredData) {
    const promises = [
      query(schet, TypeQuery.POKOL, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
      query(schet, TypeQuery.POSUM, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
      query(schet, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
      query(schet, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
      query(schet, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
      query(schet, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
    ];

    const [POKOL, POSUM, TDKOL, TDSUM, TKKOL, TKSUM] = await Promise.all(promises);

    if (POKOL || POSUM || TDKOL || TDSUM || TKKOL || TKSUM) {
      let element = {
        name: item.name,
        POKOL,
        POSUM,
        TDKOL,
        TDSUM,
        TKKOL,
        TKSUM
      };
      
      if (Object.keys(element).length) {
          result.push(element);
      }
    }
  }
  
  // console.log('result ====>', result);
  return result;
};

export const clientItem = async ( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number | null, 
  title: string, 
  stocksService: StocksService,
  oborotsService: OborotsService
) => {    
  const promises = [
    prepareResult(data, startDate, endDate, currentSectionId, Schet.S10, TypeTMZ.MATERIAL, stocksService, oborotsService),
    prepareResult(data, startDate, endDate, currentSectionId, Schet.S21, TypeTMZ.HALFSTUFF, stocksService, oborotsService),
    // prepareResult(data, startDate, endDate, currentSectionId, Schet.S28, TypeTMZ.PRODUCT, stocksService, oborotsService),
  ];

  const [materialResults, halfstuffResults] = await Promise.all(promises);

  const result = [
    ...materialResults,
    ...halfstuffResults,
    // ...productResults,
  ];
    
  return { 
      section: title,
      sectionId: currentSectionId,
      items: result
  };
};