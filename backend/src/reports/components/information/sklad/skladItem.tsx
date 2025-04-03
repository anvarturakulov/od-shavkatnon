import { TypeReference } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { Reference } from 'src/references/reference.model';
import { query } from 'src/reports/querys/query';
import { StocksService } from 'src/stocks/stocks.service';

export const skladItem = async ( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  title: string, 
  stocksService: StocksService,
  oborotsService: OborotsService
) => {    
    let result: any[] = [];
    let filteredData: Reference[] = [];

    if (data && data.length) {
      filteredData = data.filter((item: Reference) => item?.typeReference == TypeReference.TMZ);
    }

    for (const item of filteredData) { 
      const promises = [
        query(Schet.S10, TypeQuery.POKOL, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
        query(Schet.S21, TypeQuery.POKOL, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
        query(Schet.S10, TypeQuery.POSUM, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
        query(Schet.S21, TypeQuery.POSUM, startDate, endDate, currentSectionId, item.id, null, stocksService, oborotsService),
      ];

      const [pokolS10, pokolS21, posumS10, posumS21] = await Promise.all(promises);

      const POKOL = pokolS10 + pokolS21;
      const POSUM = posumS10 + posumS21;
      
      const value = POKOL;
      const valueSum = POSUM;
      const bag = item.refValues.un ? value / 50 : 0;
      let price = value ? valueSum / value : 0;
      price = item.refValues.un ? price * 50 : price;

      if (value != 0) {
        let element = {
          name: item.name,
          value,
          valueSum,
          price,
          bag
        };
        
        if (Object.keys(element).length) {
          result.push(element);
        }
      } 
    }
    
    return { 
        section: title,
        sectionId: currentSectionId,
        items: result
    };
};