
import { Sequelize } from 'sequelize-typescript';
import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Reference } from 'src/references/reference.model';
import { query } from 'src/reports/querys/query';

export const skladItem = async ( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  title: string, 
  sequelize: Sequelize ) => {    

    let result:any[] = []
    let filteredData:Reference[] = []

    if (data && data.length) {
      filteredData = data.filter((item: Reference) => item?.typeReference == TypeReference.TMZ)
    }

    for (const item of filteredData) { 

      const PDKOL = await query(Schet.S10, TypeQuery.PDKOL, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.PDKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);
      const PKKOL = await query(Schet.S10, TypeQuery.PKKOL, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.PKKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);
      const TDKOL = await query(Schet.S10, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.TDKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);
      const TKKOL = await query(Schet.S10, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.TKKOL, startDate, endDate, currentSectionId, item.id, null, sequelize);;
      const PDSUM = await query(Schet.S10, TypeQuery.PDSUM, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.PDSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);
      const PKSUM = await query(Schet.S10, TypeQuery.PKSUM, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.PKSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);
      const TDSUM = await query(Schet.S10, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.TDSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);
      const TKSUM = await query(Schet.S10, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item.id, null, sequelize)+
                    await query(Schet.S21, TypeQuery.TKSUM, startDate, endDate, currentSectionId, item.id, null, sequelize);;
      
      const value = PDKOL - PKKOL + TDKOL - TKKOL
      const valueSum = PDSUM - PKSUM + TDSUM - TKSUM
      const bag = item.refValues.un ? value / 50 : 0
      let price = value ? valueSum / value : 0;
      price = item.refValues.un ? price * 50 : price

      if (value != 0) {
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
      } 
    }
    
    
    return ( 
        {
        section: title,
        sectionId: currentSectionId,
        items: result
        }
    )
    
} 