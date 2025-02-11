
import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { query } from 'src/report/helpers/querys/query';

export const skladItem = ( 
  data: any,
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string, 
  globalEntrys: Array<EntryItem> | undefined ) => {    

    let result = []
    
    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == TypeReference.TMZ)
    .forEach((item: ReferenceModel) => {

      const PDKOL = query(Schet.S10, TypeQuery.PDKOL, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.PDKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);
      const PKKOL = query(Schet.S10, TypeQuery.PKKOL, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.PKKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);
      const TDKOL = query(Schet.S10, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);
      const TKKOL = query(Schet.S10, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);;
      const PDSUM = query(Schet.S10, TypeQuery.PDSUM, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.PDSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);
      const PKSUM = query(Schet.S10, TypeQuery.PKSUM, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.PKSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);
      const TDSUM = query(Schet.S10, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);
      const TKSUM = query(Schet.S10, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item._id, globalEntrys)+
                    query(Schet.S21, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);;
      
      
      const value = PDKOL - PKKOL + TDKOL - TKKOL
      const valueSum = PDSUM - PKSUM + TDSUM - TKSUM
      const bag = item.un ? value / 50 : 0
      let price = value ? valueSum / value : 0;
      price = item.un ? price * 50 : price

      if (value == 0) return {}

      let element = {
        name: item.name,
        value,
        valueSum,
        price,
        bag
      }
      
      if (Object.keys(element).length) {
          result.push(element)
      }
    })
    
    return ( 
        {
        section: title,
        sectionId: currentSectionId,
        items: result
        }
    )
    
} 