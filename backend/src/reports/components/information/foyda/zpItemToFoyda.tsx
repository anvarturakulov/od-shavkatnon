import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { queryKor } from 'src/reports/querys/queryKor';


export const zpItemToFoyda = async ( 
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  oborotsService: OborotsService,
  ) => {
  
  let zp = 0;
  zp = await queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, oborotsService);
  
  return zp
} 