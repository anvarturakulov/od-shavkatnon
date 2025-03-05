
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';

export const materialItem = ( 
  data: any,
  startDate: number,
  endDate: number,
  title: string, 
  materialId: string, 
  un: boolean,
  globalEntrys: Array<EntryItem> | undefined ) => {    

  const idZagatovka27 = '659ce9a8523a48fdeb6ad92f';
  const countComeHS = queryKor(Schet.S21, Schet.S23, TypeQuery.OKK, startDate, endDate, '', '', globalEntrys);
  const countLeaveHS = queryKor(Schet.S20, Schet.S21, TypeQuery.OKK, startDate, endDate, '', '', globalEntrys);

  let count = queryKor(Schet.S20, Schet.S10, TypeQuery.OKK, startDate, endDate, '', String(materialId), globalEntrys) +
              queryKor(Schet.S23, Schet.S10, TypeQuery.OKK, startDate, endDate, '', String(materialId), globalEntrys);
  let summa = queryKor(Schet.S20, Schet.S10, TypeQuery.OKS, startDate, endDate, '', String(materialId), globalEntrys) +
              queryKor(Schet.S23, Schet.S10, TypeQuery.OKS, startDate, endDate, '', String(materialId), globalEntrys);
  
  if (un && countComeHS>0) {
    let koef = countLeaveHS/countComeHS
    // console.log(koef)
    if (koef <= 1) {
      count = Math.round((count * koef) * 100) / 100;
      summa = Math.round((summa * koef) * 100) / 100;
    }
  }
  // console.log(title,count,summa )

  if (count == 0 && summa == 0) return {}

  let element = {
    title,
    count,
    summa
  }
    
  // console.log('Materialga kirayapri')
  return element
    
} 