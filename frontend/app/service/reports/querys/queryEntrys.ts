import { Maindata } from '@/app/context/app.context.interfaces';
import { EntryItem, Schet, TypeQuery } from '@/app/interfaces/report.interface';

export const queryEntrys = (
    schet: Schet,
    typequery: TypeQuery, 
    secondSubcontoId: string | null,
    mainData: Maindata,
    bodyByFirstSunconto?: boolean,
    fixedReferencyId?: string,
): Array<EntryItem> => {

  const { reportOption } = mainData;
  let { startDate, endDate, entrys } = reportOption;
  
  endDate = endDate

  let { firstReferenceId } = reportOption;

  if (bodyByFirstSunconto && fixedReferencyId) {
    firstReferenceId = fixedReferencyId;
  }

  let flag = (firstReferenceId == null || firstReferenceId.length == 0)
  let flagSubconto2 = (secondSubcontoId == null)
  let newEntrys = [...entrys]
  
  switch (typequery) {
    case TypeQuery.TDSUMEntrys:
        return newEntrys.filter((item: EntryItem) => {
          return (
            item.debet == schet &&
            (flag || item.debetFirstSubcontoId == firstReferenceId) &&
            (flagSubconto2 || item.debetSecondSubcontoId == secondSubcontoId) &&
            item.date >= startDate &&
            item.date <= endDate
          )
        })
    
    case TypeQuery.TKSUMEntrys:
        return newEntrys.filter((item: EntryItem) => {
          return (
            item.kredit == schet &&
            (flag || item.kreditFirstSubcontoId == firstReferenceId) &&
            (flagSubconto2 || item.kreditSecondSubcontoId == secondSubcontoId) &&
            item.date >= startDate &&
            item.date <= endDate
          )
        })

    case TypeQuery.AllEntrys:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.kredit == schet || item.debet == schet) &&
          (
            (flag || item.kreditFirstSubcontoId == firstReferenceId) ||
            (flag || item.debetFirstSubcontoId == firstReferenceId)
          ) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
    
    }

    
  
  return []
}