import { ReferenceModel, TypeReference, TypeTMZ } from 'src/interfaces/reference.interface';
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryForOborotka } from './queryForOborotka';

const getName = (data: any, id:string): string => {
  if (id == '') return 'ТАНЛАНМАГАН КАТОР';
  if (data && data.length) {
    return data.filter((item: ReferenceModel) => String(item?._id) == id)[0]?.name;
  }
  return 'ТАНЛАНМАГАН КАТОР';
  
}

export const oborotkaItem = ( 
  data: any,
  startDate: number,
  endDate: number,
  firstSubcontoId: string,
  secondList: any,
  schet: string,
  globalEntrys: Array<EntryItem> | undefined ) => {    

    const PDSUM = queryForOborotka(schet, TypeQuery.PDSUM, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    const PDKOL = queryForOborotka(schet, TypeQuery.PDKOL, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    const PKSUM = queryForOborotka(schet, TypeQuery.PKSUM, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    const PKKOL = queryForOborotka(schet, TypeQuery.PKKOL, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    const TDSUM = queryForOborotka(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    const TDKOL = queryForOborotka(schet, TypeQuery.TDKOL, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    const TKSUM = queryForOborotka(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    const TKKOL = queryForOborotka(schet, TypeQuery.TKKOL, startDate, endDate, firstSubcontoId, 'none', globalEntrys);
    
    if ( !PDSUM && !PKSUM && !TDSUM && !TKSUM) return {}
    
    let subResults = []
    
    secondList &&
    secondList.length > 0 &&
    secondList
    .forEach((secondSubcontoId: string) => {
      const subPDSUM = queryForOborotka(schet, TypeQuery.PDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
      const subPDKOL = queryForOborotka(schet, TypeQuery.PDKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
      
      const subPKSUM = queryForOborotka(schet, TypeQuery.PKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
      const subPKKOL = queryForOborotka(schet, TypeQuery.PKKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
      
      const subTDSUM = queryForOborotka(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
      const subTDKOL = queryForOborotka(schet, TypeQuery.TDKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
      
      const subTKSUM = queryForOborotka(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
      const subTKKOL = queryForOborotka(schet, TypeQuery.TKKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, globalEntrys);
            
      if (subPDSUM || subPKSUM || subTDSUM || subTKSUM || subPDKOL || subPKKOL || subTDKOL || subTKKOL) {
        let subElement = {
          name: getName(data, secondSubcontoId),
          sectionId: secondSubcontoId,
          subPDSUM,
          subPDKOL,
          subPKSUM,
          subPKKOL,
          subTDSUM,
          subTDKOL,
          subTKSUM,
          subTKKOL,
        }
        subResults.push(subElement) 
      } 

    })

    let element = {
      name: getName(data, firstSubcontoId),
      sectionId: firstSubcontoId,
      PDSUM,
      PDKOL,
      PKSUM,
      PKKOL,
      TDSUM,
      TDKOL,
      TKSUM,
      TKKOL,
      subItems: [...subResults]
    }
    return element
    
} 