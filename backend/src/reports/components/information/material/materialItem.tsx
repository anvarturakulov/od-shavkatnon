
import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/reports/querys/queryKor';

export const materialItem = async ( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  title: string, 
  materialId: number, 
  un: boolean | undefined,
  sequelize: Sequelize ) => {    

  const idZagatovka27 = -1;
  const countComeHS = await queryKor(Schet.S21, Schet.S23, TypeQuery.OKK, startDate, endDate, null, null, null, sequelize);
  const countLeaveHS = await queryKor(Schet.S20, Schet.S21, TypeQuery.OKK, startDate, endDate, null, null, null, sequelize);

  let count = await queryKor(Schet.S20, Schet.S10, TypeQuery.OKK, startDate, endDate, null, materialId, null, sequelize) +
              await queryKor(Schet.S23, Schet.S10, TypeQuery.OKK, startDate, endDate, null, materialId, null, sequelize);
  let summa = await queryKor(Schet.S20, Schet.S10, TypeQuery.OKS, startDate, endDate, null, materialId, null, sequelize) +
              await queryKor(Schet.S23, Schet.S10, TypeQuery.OKS, startDate, endDate, null, materialId, null, sequelize);
  
  if (un && countComeHS>0) {
    let koef = countLeaveHS/countComeHS
    // console.log(koef)
    if (koef <= 1) {
      count = Math.round((count * koef) * 100) / 100;
      summa = Math.round((summa * koef) * 100) / 100;
    }
  }

  if (count == 0 && summa == 0) return {}

  let element = {
    title,
    count,
    summa
  }
    
  return element
    
} 