import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { queryKor } from 'src/reports/querys/queryKor';

export const materialItem = async ( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  title: string, 
  materialId: number, 
  un: boolean | undefined,
  obortsService: OborotsService
) => {    
  const idZagatovka27 = -1;

  const promises = [
    queryKor(Schet.S21, Schet.S23, TypeQuery.OKK, startDate, endDate, null, null, null, obortsService), // countComeHS
    queryKor(Schet.S20, Schet.S21, TypeQuery.OKK, startDate, endDate, null, null, null, obortsService), // countLeaveHS
    queryKor(Schet.S20, Schet.S10, TypeQuery.OKK, startDate, endDate, null, materialId, null, obortsService), // count часть 1
    queryKor(Schet.S23, Schet.S10, TypeQuery.OKK, startDate, endDate, null, materialId, null, obortsService), // count часть 2
    queryKor(Schet.S20, Schet.S10, TypeQuery.OKS, startDate, endDate, null, materialId, null, obortsService), // summa часть 1
    queryKor(Schet.S23, Schet.S10, TypeQuery.OKS, startDate, endDate, null, materialId, null, obortsService), // summa часть 2
  ];

  const [
    countComeHS,
    countLeaveHS,
    countPart1,
    countPart2,
    summaPart1,
    summaPart2,
  ] = await Promise.all(promises);

  let count = countPart1 + countPart2;
  let summa = summaPart1 + summaPart2;

  if (un && countComeHS > 0) {
    let koef = countLeaveHS / countComeHS;
    if (koef <= 1) {
      count = Math.round((count * koef) * 100) / 100;
      summa = Math.round((summa * koef) * 100) / 100;
    }
  }

  if (count == 0 && summa == 0) return {};

  let element = {
    title,
    count,
    summa
  };
    
  return element;
};