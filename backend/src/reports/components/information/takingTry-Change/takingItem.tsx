
import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { queryKorFull } from 'src/reports/querys/queryKorFull';

export const takingItem = async ( 
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  title: string, 
  oborotsService: OborotsService ) => {    
  
    const glBuxId = -1;
    //shu erni uzgartirish kerak
    const OBSUMK5050 = await queryKorFull(Schet.S50, Schet.S50, TypeQuery.OS, startDate, endDate, glBuxId, -1, null, currentSectionId, null, null, oborotsService);
    if (!OBSUMK5050) return {}
    return ( 
        {
        section: title,
        taking: OBSUMK5050
        }
    )
    
} 