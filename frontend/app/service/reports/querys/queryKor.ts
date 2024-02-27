import { Maindata } from '@/app/context/app.context.interfaces';
import { EntryItem, Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { getDateFromStorageExceptNull } from '../../documents/getDateFromStorageExceptNull';

export const queryKor = (
  debetSchet: Schet,
  kreditSchet: Schet,
  typequery: TypeQuery,
  firstSubconto: string | null,
  secondSubconto: string | null,
  mainData: Maindata,
  forDashboard? : boolean
): number => {

  const { reportOption } = mainData;
  let { startDate, endDate, entrys, dashboardEntrys } = reportOption;
  
  let startDateFromStorage = Date.parse(getDateFromStorageExceptNull(localStorage.getItem('dateStartToInterval')));
  let endDateFromStorage = Date.parse(getDateFromStorageExceptNull(localStorage.getItem('dateEndToInterval')));


  let flagFirstSubconoto = true
  let flagSecondSubconto = true

  if (firstSubconto) flagFirstSubconoto = false
  if (secondSubconto) flagSecondSubconto = false

  let newEntrys = [...entrys]

  if (forDashboard) {
    startDate = startDateFromStorage;
    endDate = endDateFromStorage;
    newEntrys = [...dashboardEntrys]
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