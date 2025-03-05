import { EntryItem, QueryObject, Schet, TypeQuery } from 'src/interfaces/report.interface';

export const queryKorFull = (
  debet: string,
  kredit: string,
  typeQuery: string,
  startDate: number,
  endDate: number,
  debetFirstSubcontoId: string,
  debetSecondSubcontoId: string,
  kreditFirstSubcontoId: string,
  kreditSecondSubcontoId: string,
  globalEntrys: Array<EntryItem> | undefined) => {

  let newEntrys = globalEntrys?.length ? [...globalEntrys] : [] 
  
  switch (typeQuery) {
    case TypeQuery.OS:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debet &&
          item.kredit == kredit &&
          ( debetFirstSubcontoId =='' || item.debetFirstSubcontoId == debetFirstSubcontoId ) &&
          ( debetSecondSubcontoId =='' || item.debetSecondSubcontoId == debetSecondSubcontoId 
            // || item.count == -1) &&
            || (debetSecondSubcontoId == 'cash' && item.count == -1)) &&
          ( kreditFirstSubcontoId =='' || item.kreditFirstSubcontoId == kreditFirstSubcontoId ) &&
          ( kreditSecondSubcontoId =='' || item.kreditSecondSubcontoId == kreditSecondSubcontoId 
            || (kreditSecondSubcontoId == 'cash' && item.count == -1)) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
      .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.OK:
      return newEntrys.filter((item: EntryItem) => {
        return (
          item.debet == debet &&
          item.kredit == kredit &&
          ( debetFirstSubcontoId =='' || item.debetFirstSubcontoId == debetFirstSubcontoId ) &&
          ( debetSecondSubcontoId =='' || item.debetSecondSubcontoId == debetSecondSubcontoId ) &&
          ( kreditFirstSubcontoId =='' || item.kreditFirstSubcontoId == kreditFirstSubcontoId ) &&
          ( kreditSecondSubcontoId =='' || item.kreditSecondSubcontoId == kreditSecondSubcontoId ) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
      .reduce((acc, item: EntryItem) => acc + item.count, 0)
  }

  // return 0
}