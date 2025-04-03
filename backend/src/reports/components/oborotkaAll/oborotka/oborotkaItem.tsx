import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { query } from 'src/reports/querys/query';
import { Reference } from 'src/references/reference.model';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

const getName = (data: any, id: number | null): string => {
  if (id == null) return 'ТАНЛАНМАГАН КАТОР';
  if (data && data.length) {
    return data.filter((item: Reference) => item.id == id)[0]?.name || 'ТАНЛАНМАГАН КАТОР';
  }
  return 'ТАНЛАНМАГАН КАТОР';
};

export const oborotkaItem = async ( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  firstSubcontoId: number | null,
  secondList: any,
  schet: Schet | null,
  stocksService: StocksService,
  oborotsService: OborotsService
) => {    
  const topPromisesRemains = [
    query(schet, TypeQuery.POSUM, startDate, endDate, firstSubcontoId, null, null, stocksService, oborotsService),
    query(schet, TypeQuery.KOSUM, startDate, endDate, firstSubcontoId, null, null, stocksService, oborotsService),
    query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, null, null, stocksService, oborotsService),
    query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, null, null, stocksService, oborotsService),
    
  ];

  const [POSUM, KOSUM, TDSUM, TKSUM] = await Promise.all(topPromisesRemains);
  
  
  let subResults: any[] = [];
  
  if (secondList && secondList.length) {
    for (const secondSubcontoId of secondList) {
      const subPromises = [
        query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, stocksService, oborotsService),
        query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, stocksService, oborotsService),
      ];
      
      const [subTDSUM, subTKSUM] = await Promise.all(subPromises);
      
      if (subTDSUM || subTKSUM ) {
        let subElement = {
          name: getName(data, secondSubcontoId),
          sectionId: secondSubcontoId,
          subTDSUM,
          subTKSUM,
        };
        subResults.push(subElement);
      }
    }
  }
  
  // const topPromises = [
  //   subResults.reduce((acc, curr) => acc + curr.subTDSUM, 0),
  //   subResults.reduce((acc, curr) => acc + curr.subTKSUM, 0),
  // ];

  // const [TDSUM, TKSUM] = await Promise.all(topPromises);
  

  if (!POSUM && !POSUM && !TDSUM && !TKSUM) return {};

  let element = {
    name: getName(data, firstSubcontoId),
    sectionId: firstSubcontoId,
    POSUM,
    TDSUM,
    TKSUM,
    KOSUM,
    subItems: [...subResults]
  };
  return element;
};