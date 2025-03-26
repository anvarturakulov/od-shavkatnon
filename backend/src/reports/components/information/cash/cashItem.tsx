import { Schet, TypeQuery } from 'src/interfaces/report.interface';

import { Sequelize } from 'sequelize-typescript';
import { query } from 'src/reports/querys/query';
import { queryKor } from 'src/reports/querys/queryKor';
import { StocksService } from 'src/stocks/stocks.service';

export const cashItem = async ( 
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number | null, 
  title: string, 
  sequelize: Sequelize,
  stocksService: StocksService
) => {

  
  const POSUM = await query( Schet.S50, TypeQuery.POSUM, startDate, endDate, currentSectionId, null, null, sequelize, stocksService);
  const KOSUM = await query( Schet.S50, TypeQuery.KOSUM, startDate, endDate, currentSectionId, null, null, sequelize, stocksService);
  
  const TRADEINCOME = await queryKor(Schet.S50, Schet.S40, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);
  const MOVEINCOME = await queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);
  const MOVEOUT = await queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const CHARGES = 
  await queryKor(Schet.S20, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize) + 
  await queryKor(Schet.S67, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  
  const FORPARTNERS = await queryKor(Schet.S60, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const FORFOUNDER = await queryKor(Schet.S66, Schet.S50, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);

  if ( !(POSUM) && !(TRADEINCOME+MOVEINCOME) && !(CHARGES+FORPARTNERS+MOVEOUT+FORFOUNDER) 
      && !(KOSUM)) return {}
  return (
    {
      section: title,
      startBalans: POSUM,
      sale: TRADEINCOME,
      moveIncome: MOVEINCOME,
      allIncome: TRADEINCOME+MOVEINCOME,
      charges: CHARGES,
      forPartner: FORPARTNERS,
      moveOut: MOVEOUT,
      forFounder: FORFOUNDER,
      allOut: CHARGES+ FORPARTNERS+MOVEOUT+FORFOUNDER,
      endBalans: KOSUM
    }
      
  )
} 