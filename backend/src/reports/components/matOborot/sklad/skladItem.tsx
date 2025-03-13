
import { Sequelize } from 'sequelize-typescript';
import { TypeTMZ } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Reference } from 'src/references/reference.model';
import { query } from 'src/reports/querys/query';

const prepareResult = async (data: any[], startDate, endDate, currentSectionId, sequelize, schet, typeTMZ: TypeTMZ) => {
  let result:any[] = [];
  let filteredData:Reference[] = []

  if (data && data.length) {
    filteredData = data.filter((item: Reference) => item?.refValues.typeTMZ == typeTMZ)
  }
  
  for (const item of filteredData) {
    const PDKOL = await query(schet, TypeQuery.PDKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);
    const PDSUM = await query(schet, TypeQuery.PDSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);
    const PKKOL = await query(schet, TypeQuery.PKKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);
    const PKSUM = await query(schet, TypeQuery.PKSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);
    const TDKOL = await query(schet, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);
    const TDSUM = await query(schet, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);
    const TKKOL = await query(schet, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);
    const TKSUM = await query(schet, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);

    if (PDKOL || PDSUM || PKKOL || PKSUM || TDKOL || TDSUM || TKKOL || TKSUM) {
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
  sequelize: Sequelize ) => {    

    let result:any[] = []
    result = [
      ... await prepareResult(data, startDate, endDate, currentSectionId, sequelize, Schet.S10, TypeTMZ.MATERIAL),
      ... await prepareResult(data, startDate, endDate, currentSectionId, sequelize, Schet.S21, TypeTMZ.HALFSTUFF),
      ... await prepareResult(data, startDate, endDate, currentSectionId, sequelize, Schet.S28, TypeTMZ.PRODUCT),
    ]
    
    return ( 
        {
          section: title,
          sectionId: currentSectionId,
          items: result
        }
    )
    
} 