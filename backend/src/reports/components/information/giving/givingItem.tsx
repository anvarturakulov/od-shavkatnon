
import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKorFull } from 'src/reports/querys/queryKorFull';

export const givingItem = async ( 
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  title: string, 
  sequelize: Sequelize ) => {    
  
    // Anvar shu erni uzgartirish kerak
    const glBuxId = -1;
    const OBSUM50 = await queryKorFull(Schet.S20, Schet.S50, TypeQuery.OS, startDate, endDate, null, currentSectionId, null, glBuxId, -1, null, sequelize)
    + await queryKorFull(Schet.S60, Schet.S50, TypeQuery.OS, startDate, endDate, currentSectionId, null, null, glBuxId, -1, null, sequelize) 
    + await queryKorFull(Schet.S50, Schet.S50, TypeQuery.OS, startDate, endDate, currentSectionId, null, null, glBuxId, -1, null, sequelize)
    + await queryKorFull(Schet.S67, Schet.S50, TypeQuery.OS, startDate, endDate, currentSectionId, null, null, glBuxId, -1, null, sequelize) ;

    if (!OBSUM50) return {}
    return ( 
        { section: title,
          giving: OBSUM50 }
    )
    
} 