
import { ReferenceModel, TypeReference, TypeTMZ } from 'src/interfaces/reference.interface';
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { query } from 'src/report/helpers/querys/query';

const prepareResult = (data: any[], startDate, endDate, currentSectionId, globalEntrys, schet, typeTMZ: TypeTMZ): any[] => {
  let result = [];
  
  data && 
  data.length > 0 &&
  data
  .filter((item: any) => item?.typeTMZ == typeTMZ)
  .forEach((item: ReferenceModel) => {
      
    const PDKOL = query(schet, TypeQuery.PDKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);
    const PDSUM = query(schet, TypeQuery.PDSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);
    const PKKOL = query(schet, TypeQuery.PKKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);
    const PKSUM = query(schet, TypeQuery.PKSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);
    const TDKOL = query(schet, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);
    const TDSUM = query(schet, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);
    const TKKOL = query(schet, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item._id, globalEntrys);
    const TKSUM = query(schet, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item._id, globalEntrys);
    
    if ( !PDKOL && !PDSUM && !PKKOL && !PKSUM && !TDKOL && !TDSUM && !TKKOL && !TKSUM) return {}

    let element = {
      name: item.name,
      PDKOL,
      PDSUM,
      PKKOL,
      PKSUM,
      TDKOL,
      TDSUM,
      TKKOL,
      TKSUM
    }
    
    if (Object.keys(element).length) {
        result.push(element)
    }
  })

  return result

}

export const skladItem = ( 
  data: any,
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string, 
  globalEntrys: Array<EntryItem> | undefined ) => {    

    let result = []
    result = [
      ... prepareResult(data, startDate, endDate, currentSectionId, globalEntrys, Schet.S10, TypeTMZ.MATERIAL),
      ... prepareResult(data, startDate, endDate, currentSectionId, globalEntrys, Schet.S21, TypeTMZ.HALFSTUFF),
      ... prepareResult(data, startDate, endDate, currentSectionId, globalEntrys, Schet.S28, TypeTMZ.PRODUCT),
    
    ]
    
    
    return ( 
        {
        section: title,
        sectionId: currentSectionId,
        items: result
        }
    )
    
} 