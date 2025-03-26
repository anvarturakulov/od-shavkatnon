import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Sequelize } from 'sequelize-typescript';
import { query } from 'src/reports/querys/query';
import { Reference } from 'src/references/reference.model';
import { StocksService } from 'src/stocks/stocks.service';

const getName = (data: any, id:number | null): string => {
  if (id == null) return 'ТАНЛАНМАГАН КАТОР';
  if (data && data.length) {
    return data.filter((item: Reference) => item.id == id)[0]?.name;
  }
  return 'ТАНЛАНМАГАН КАТОР';
  
}

export const oborotkaItem = async( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  firstSubcontoId: number | null,
  secondList: any,
  schet: Schet | null,
  sequelize:Sequelize,
  stocksService: StocksService
) => {    

    const POSUM = await query(schet, TypeQuery.POSUM, startDate, endDate, firstSubcontoId, null, null, sequelize, stocksService);
    const POKOL = await query(schet, TypeQuery.POKOL, startDate, endDate, firstSubcontoId, null, null, sequelize, stocksService);
    const TDSUM = await query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, null, null, sequelize, stocksService);
    const TDKOL = await query(schet, TypeQuery.TDKOL, startDate, endDate, firstSubcontoId, null, null, sequelize, stocksService);
    const TKSUM = await query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, null, null, sequelize, stocksService);
    const TKKOL = await query(schet, TypeQuery.TKKOL, startDate, endDate, firstSubcontoId, null, null, sequelize, stocksService);
    
    if ( !POSUM && !POSUM && !TDSUM && !TKSUM) return {}
    
    let subResults:any[] = []
    
    if (secondList && secondList.length) {
      for (const secondSubcontoId of secondList) {
        const subPOSUM = await query(schet, TypeQuery.POSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize, stocksService);
        const subPOKOL = await query(schet, TypeQuery.POKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize, stocksService);
        
        const subTDSUM = await query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize, stocksService);
        const subTDKOL = await query(schet, TypeQuery.TDKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize, stocksService);
        
        const subTKSUM = await query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize, stocksService);
        const subTKKOL = await query(schet, TypeQuery.TKKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize, stocksService);
              
        if (subPOSUM || subPOSUM || subTDSUM || subTKSUM || subTDKOL || subTKKOL) {
          let subElement = {
            name: getName(data, secondSubcontoId),
            sectionId: secondSubcontoId,
            subPOSUM,
            subPOKOL,
            subTDSUM,
            subTDKOL,
            subTKSUM,
            subTKKOL,
          }
          subResults.push(subElement) 
        } 
      }
    }

    let element = {
      name: getName(data, firstSubcontoId),
      sectionId: firstSubcontoId,
      POSUM,
      POKOL,
      TDSUM,
      TDKOL,
      TKSUM,
      TKKOL,
      subItems: [...subResults]
    }
    return element
    
} 