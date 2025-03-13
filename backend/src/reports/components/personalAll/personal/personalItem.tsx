import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Sequelize } from 'sequelize-typescript';
import { query } from 'src/reports/querys/query';
import { Reference } from 'src/references/reference.model';
import { Entry } from 'src/entries/entry.model';

const getName = (data: any, id:number | null): string => {
  if (id == null) return 'ТАНЛАНМАГАН КАТОР';
  if (data && data.length) {
    return data.filter((item: Reference) => item.id == id)[0]?.name;
  }
  return 'ТАНЛАНМАГАН КАТОР';
  
}

export const personalItem = async( 
  data: any,
  entries: Entry[],
  startDate: number | null,
  endDate: number | null,
  firstSubcontoId: number | null,
  sequelize:Sequelize ) => {    

    const PDSUM = await query(Schet.S67, TypeQuery.PDSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const PKSUM = await query(Schet.S67, TypeQuery.PKSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const TDSUM = await query(Schet.S67, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const TKSUM = await query(Schet.S67, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    
    if ( !PDSUM && !PKSUM && !TDSUM && !TKSUM) return {}
    
    let subResults:any[] = []
    
    if (entries && entries.length) {
      for (const entry of entries) {

        const subPDSUM = await query(schet, TypeQuery.PDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
        const subPDKOL = await query(schet, TypeQuery.PDKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
        
        const subPKSUM = await query(schet, TypeQuery.PKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
        const subPKKOL = await query(schet, TypeQuery.PKKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
        
        const subTDSUM = await query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
        const subTDKOL = await query(schet, TypeQuery.TDKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
        
        const subTKSUM = await query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
        const subTKKOL = await query(schet, TypeQuery.TKKOL, startDate, endDate, firstSubcontoId, secondSubcontoId, null, sequelize);
              
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
      }
    }

    let element = {
      name: getName(data, firstSubcontoId),
      PDSUM,
      PKSUM,
      TDSUM,
      TKSUM,
      subItems: [...subResults]
    }
    return element
    
} 