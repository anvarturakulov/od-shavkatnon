import { Maindata } from '@/app/context/app.context.interfaces';
import { EntryItem, Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { getDateFromStorageExceptNull } from '../../documents/getDateFromStorageExceptNull';

export const queryKor = (
  debetSchet: Schet,
  kreditSchet: Schet,
  typequery: TypeQuery,
  firstSubconto: string | undefined,
  secondSubconto: string | undefined,
  mainData: Maindata,
  forDashboard? : boolean,
): number => {

  const { reportOption, interval } = mainData;
  let { startDate, endDate, entrys } = reportOption;
  endDate = endDate
  
  let flagFirstSubconoto = true
  let flagSecondSubconto = true

  if (Boolean(firstSubconto) == true) flagFirstSubconoto = false
  if (Boolean(secondSubconto) == true) flagSecondSubconto = false

  let newEntrys = [...entrys]

  if (forDashboard) {
    startDate = interval.dateStart;
    endDate = interval.dateEnd;
  }

  switch (typequery) {
    case TypeQuery.ODS:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debetSchet &&
          item.kredit == kreditSchet &&
          (flagFirstSubconoto || item.debetFirstSubcontoId == firstSubconto) &&
          (flagSecondSubconto || item.debetSecondSubcontoId == secondSubconto) &&
          item.date >= startDate && 
          item.date <= endDate  
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.ODK:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debetSchet &&
          item.kredit == kreditSchet &&
          (flagFirstSubconoto || item.debetFirstSubcontoId == firstSubconto) &&
          (flagSecondSubconto || item.debetSecondSubcontoId == secondSubconto) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)
      
    case TypeQuery.OKS:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debetSchet &&
          item.kredit == kreditSchet &&
          (flagFirstSubconoto || item.kreditFirstSubcontoId == firstSubconto) &&
          (flagSecondSubconto || item.kreditSecondSubcontoId == secondSubconto) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)
      
    case TypeQuery.OKK:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debetSchet &&
          item.kredit == kreditSchet &&
          (flagFirstSubconoto || item.kreditFirstSubcontoId == firstSubconto) &&
          (flagSecondSubconto || item.kreditSecondSubcontoId == secondSubconto) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)
  }

  return 0
}