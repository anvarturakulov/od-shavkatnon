
import { Sequelize } from 'sequelize-typescript';
import { TypeTMZ } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Reference } from 'src/references/reference.model';
import { query } from 'src/reports/querys/query';
import { StocksService } from 'src/stocks/stocks.service';

const prepareResult = async (data: any[], startDate, endDate, currentSectionId, sequelize, schet, typeTMZ: TypeTMZ, stocksService: StocksService) => {
  let result:any[] = [];
  let filteredData:Reference[] = []

  if (data && data.length) {
    filteredData = data.filter((item: Reference) => item?.refValues.typeTMZ == typeTMZ)
  }
  
  for (const item of filteredData) {
    const POKOL = await query(schet, TypeQuery.POKOL, startDate, endDate, currentSectionId, item.id, null, sequelize, stocksService);
    const POSUM = await query(schet, TypeQuery.POSUM, startDate, endDate, currentSectionId, item.id, null, sequelize, stocksService);
    const TDKOL = await query(schet, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item.id, null, sequelize, stocksService);
    const TDSUM = await query(schet, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item.id, null, sequelize, stocksService);
    const TKKOL = await query(schet, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item.id, null, sequelize, stocksService);
    const TKSUM = await query(schet, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item.id, null, sequelize, stocksService);

    if (POKOL || POSUM  || TDKOL || TDSUM || TKKOL || TKSUM) {
      let element = {
        name: item.name,
        POKOL,
        POSUM,
        TDKOL,
        TDSUM,
        TKKOL,
        TKSUM
      }
      
      if (Object.keys(element).length) {
          result.push(element)
      }
    }
  }
  
  console.log('result ====>', result)
  return result

}

export const skladItem = async( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number | null, 
  title: string, 
  sequelize: Sequelize,
  stocksService: StocksService
) => {    

    let result:any[] = []
    result = [
      ... await prepareResult(data, startDate, endDate, currentSectionId, sequelize, Schet.S10, TypeTMZ.MATERIAL, stocksService),
      ... await prepareResult(data, startDate, endDate, currentSectionId, sequelize, Schet.S21, TypeTMZ.HALFSTUFF, stocksService),
      ... await prepareResult(data, startDate, endDate, currentSectionId, sequelize, Schet.S28, TypeTMZ.PRODUCT, stocksService),
    ]
    
    return ( 
        {
          section: title,
          sectionId: currentSectionId,
          items: result
        }
    )
    
} 