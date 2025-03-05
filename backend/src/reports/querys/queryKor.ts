import { EntryItem, QueryObject, Schet, TypeQuery } from 'src/interfaces/report.interface';

export const queryKor = (
  debet: string,
  kredit: string,
  typeQuery: string,
  startDate: number,
  endDate: number,
  firstSubcontoId: string,
  secondSubcontoId: string,
  globalEntrys: Array<EntryItem> | undefined) => {

  let newEntrys = globalEntrys?.length ? [...globalEntrys] : [] 
  
  switch (typeQuery) {
    case TypeQuery.ODS:
      return newEntrys.filter((item: EntryItem) => {

        return (
          item.debet == debet &&
          item.kredit == kredit &&
          ( firstSubcontoId=='' || item.debetFirstSubcontoId == firstSubcontoId) &&
          ( secondSubcontoId=='' || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
      .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.ODK:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debet &&
          item.kredit == kredit &&
          ( firstSubcontoId=='' || item.debetFirstSubcontoId == firstSubcontoId) &&
          ( secondSubcontoId=='' || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
      .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.OKS:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debet &&
          item.kredit == kredit &&
          ( firstSubcontoId=='' || item.kreditFirstSubcontoId == firstSubcontoId) &&
          ( secondSubcontoId=='' || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
      .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.OKK:
      return newEntrys.filter((item: EntryItem) => {
        
        return (
          item.debet == debet &&
          item.kredit == kredit &&
          ( firstSubcontoId=='' || item.kreditFirstSubcontoId == firstSubcontoId) &&
          ( secondSubcontoId=='' || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
      .reduce((acc, item: EntryItem) => acc + item.count, 0)
  }

  // return 0
}