import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Sequelize } from 'sequelize-typescript';
import { query } from 'src/reports/querys/query';
import { Reference } from 'src/references/reference.model';
import { Entry } from 'src/entries/entry.model';

const getName = (data: any, id:number | null): string => {
  if (id == null) return '';
  if (data && data.length) {
    return data.filter((item: Reference) => item.id == id)[0]?.name;
  }
  return '';
  
}

export const personalItem = async( 
  data: any,
  entries: Entry[],
  startDate: number | null,
  endDate: number | null,
  workerId: number | null,
  sequelize:Sequelize ) => {    

    const PDSUM = await query(Schet.S67, TypeQuery.PDSUM, startDate, endDate, workerId, null, null, sequelize);
    const PKSUM = await query(Schet.S67, TypeQuery.PKSUM, startDate, endDate, workerId, null, null, sequelize);
    const TDSUM = await query(Schet.S67, TypeQuery.TDSUM, startDate, endDate, workerId, null, null, sequelize);
    const TKSUM = await query(Schet.S67, TypeQuery.TKSUM, startDate, endDate, workerId, null, null, sequelize);

    if ( !PDSUM && !PKSUM && !TDSUM && !TKSUM) return {}
    
    let subResults:any[] = []
    
    let filteredList = entries.filter(entry => {
      return (
          (entry.dataValues.debet == Schet.S67 && entry.dataValues.debetFirstSubcontoId == workerId)
          || 
          (entry.dataValues.kredit == Schet.S67 && entry.dataValues.kreditFirstSubcontoId == workerId)
      )
    }).filter(entry => {
      return (
          (startDate && endDate && entry.dataValues.date >= startDate && entry.dataValues.date <= endDate)
      )
    })

    if (filteredList && filteredList.length) {
      for (const entry of filteredList) {
        const debet = entry.dataValues.debet == Schet.S67 ? true : false
        const date = entry.dataValues.date
        const section = debet ? getName(data, entry.dataValues?.debetSecondSubcontoId) : getName(data, entry.dataValues?.kreditSecondSubcontoId) 
        const comment = entry.dataValues?.description
        const TDSUM = debet ? entry.dataValues?.total : '' 
        const TKSUM = !debet ? entry.dataValues?.total : ''
        
        if (TDSUM || TKSUM ) {
          let subElement = {
            date,
            section,
            comment,
            TDSUM,
            TKSUM
          }
          subResults.push(subElement) 
        } 
      }
    }
    
    
    let element = {
      name: getName(data, workerId),
      PDSUM,
      PKSUM,
      TDSUM,
      TKSUM,
      subItems: [...subResults]
    }
    
    return element
    
} 