import { Schet, TypeQuery } from 'src/interfaces/report.interface';

import { Sequelize } from 'sequelize-typescript';
import { query } from 'src/reports/querys/query';
import { queryKor } from 'src/reports/querys/queryKor';

export const cashItem = async ( 
  startDate: number,
  endDate: number,
  currentSectionId: number | undefined, 
  title: string, 
  sequelize: Sequelize ) => {

  
  const PDSUM = await query( Schet.S50, TypeQuery.PDSUM, startDate, endDate, currentSectionId, null, null, sequelize);
  const PKSUM = await query( Schet.S50, TypeQuery.PKSUM, startDate, endDate, currentSectionId, null, null, sequelize);
  const TRADEINCOME = await queryKor(Schet.S50, Schet.S40, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);
  const MOVEINCOME = await queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);
  const MOVEOUT = await queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const CHARGES = 
  await queryKor(Schet.S20, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize) + 
  await queryKor(Schet.S67, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  
  const FORPARTNERS = await queryKor(Schet.S60, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const FORFOUNDER = await queryKor(Schet.S66, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const TDSUM = await query( Schet.S50, TypeQuery.TDSUM,  startDate, endDate, currentSectionId, null, null, sequelize);
  const TKSUM = await query( Schet.S50, TypeQuery.TKSUM, startDate, endDate, currentSectionId, null, null, sequelize);

  if ( !(PDSUM-PKSUM) && !(TRADEINCOME+MOVEINCOME) && !(CHARGES+FORPARTNERS+MOVEOUT+FORFOUNDER) 
      && !(PDSUM-PKSUM+TDSUM-TKSUM)) return {}
  return (
    {
      section: title,
      startBalans: PDSUM-PKSUM,
      sale: TRADEINCOME,
      moveIncome: MOVEINCOME,
      allIncome: TRADEINCOME+MOVEINCOME,
      charges: CHARGES,
      forPartner: FORPARTNERS,
      moveOut: MOVEOUT,
      forFounder: FORFOUNDER,
      allOut: CHARGES+ FORPARTNERS+MOVEOUT+FORFOUNDER,
      endBalans: PDSUM-PKSUM+TDSUM-TKSUM
    }
      
  )
} 