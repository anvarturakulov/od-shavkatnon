import { EntryItem, TypeQuery } from 'src/interfaces/report.interface';

export const queryForOborotka = (
  schet: string, 
  typeQuery: string, 
  startDate: number, 
  endDate: number, 
  firstSubcontoId: string | undefined, 
  secondSubcontoId: string | undefined, 
  globalEntrys: Array<EntryItem> | undefined) => {
  
  let newEntrys = globalEntrys?.length ? [...globalEntrys] : [] 
  
  switch (typeQuery) {
    case TypeQuery.PDKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == schet &&
          (item.debetFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.PDSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == schet &&
          (item.debetFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.PKKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.kredit == schet &&
          (item.kreditFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.PKSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.kredit == schet &&
          (item.kreditFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.TDKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == schet &&
          (item.debetFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.TDSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == schet &&
          (item.debetFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.TKKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.kredit == schet &&
          (item.kreditFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.TKSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.kredit == schet &&
          (item.kreditFirstSubcontoId == firstSubcontoId) &&
          (secondSubcontoId == 'none' || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    }

}