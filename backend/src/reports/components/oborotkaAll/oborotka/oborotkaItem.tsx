import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Sequelize } from 'sequelize-typescript';
import { query } from 'src/reports/querys/query';
import { Reference } from 'src/references/reference.model';

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
  sequelize:Sequelize ) => {    

    const PDSUM = await query(schet, TypeQuery.PDSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const PDKOL = await query(schet, TypeQuery.PDKOL, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const PKSUM = await query(schet, TypeQuery.PKSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const PKKOL = await query(schet, TypeQuery.PKKOL, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const TDSUM = await query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const TDKOL = await query(schet, TypeQuery.TDKOL, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const TKSUM = await query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, null, null, sequelize);
    const TKKOL = await query(schet, TypeQuery.TKKOL, startDate, endDate, firstSubcontoId, null, null, sequelize);
    
    if ( !PDSUM && !PKSUM && !TDSUM && !TKSUM) return {}
    
    let subResults:any[] = []
    
    if (secondList && secondList.length) {
      for (const secondSubcontoId of secondList) {
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