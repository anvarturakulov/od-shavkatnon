import { Maindata } from '@/app/context/app.context.interfaces';
import { EntryItem, Schet, TypeQuery } from '@/app/interfaces/report.interface';

export const query = (
  schet: Schet | Array<Schet>,
  typequery: TypeQuery,
  secondSubcontoId: string | null,
  mainData: Maindata,
  bodyByFirstSunconto?: boolean,
  fixedReferencyId?: string,
  forDashboard?: boolean,
): number => {

  const { reportOption } = mainData;
  const { interval } = mainData
  let { startDate, endDate, entrys } = reportOption;

  // endDate = endDate + 86399999

  let { firstReferenceId } = reportOption;

  if (bodyByFirstSunconto && fixedReferencyId) {
    firstReferenceId = fixedReferencyId;
  }

  let flag = (firstReferenceId == null || firstReferenceId.length == 0)
  let flagSubconto2 = (secondSubcontoId == null)
  let newEntrys = [...entrys]

  if (forDashboard) {
    startDate = interval.dateStart;
    endDate = interval.dateEnd;
  }

  switch (typequery) {
    case TypeQuery.PDKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.debet == schet || schet.includes(item.debet)) &&
          (flag || item.debetFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.PDSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.debet == schet || schet.includes(item.debet)) &&
          (flag || item.debetFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.PKKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.kredit == schet || schet.includes(item.kredit)) &&
          (flag || item.kreditFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.PKSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.kredit == schet || schet.includes(item.kredit)) &&
          (flag || item.kreditFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date < startDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.TDKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.debet == schet || schet.includes(item.debet)) &&
          (flag || item.debetFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.TDSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.debet == schet || schet.includes(item.debet)) &&
          (flag || item.debetFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.debetSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.TKKOL:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.kredit == schet || schet.includes(item.kredit)) &&
          (flag || item.kreditFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

    case TypeQuery.TKSUM:
      return newEntrys.filter((item: EntryItem) => {
        return (
          (item.kredit == schet || schet.includes(item.kredit)) &&
          (flag || item.kreditFirstSubcontoId == firstReferenceId) &&
          (flagSubconto2 || item.kreditSecondSubcontoId == secondSubcontoId) &&
          item.date >= startDate &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

    case TypeQuery.MPRICE:
      let totalSumma = newEntrys.filter((item: EntryItem) => {

        return (
          (item.debet == schet || schet.includes(item.debet)) &&
          (item.kredit != schet || schet.includes(item.kredit)) &&
          // item.debetFirstSubcontoId == firstReferenceId &&
          item.debetSecondSubcontoId == secondSubcontoId &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.summa, 0)

      let totalCount = newEntrys.filter((item: EntryItem) => {
        return (
          (item.debet == schet || schet.includes(item.debet)) &&
          (item.kredit != schet || schet.includes(item.kredit)) &&
          // item.debetFirstSubcontoId == firstReferenceId &&
          item.debetSecondSubcontoId == secondSubcontoId &&
          item.date <= endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)

      return totalCount ? +(totalSumma / totalCount).toFixed(2) : 0;

    case TypeQuery.BALANCE:
      let countLeave = newEntrys.filter((item: EntryItem) => {
        return (
          (item.kredit == schet || schet.includes(item.kredit)) &&
          (item.kreditFirstSubcontoId == firstReferenceId) &&
          item.kreditSecondSubcontoId == secondSubcontoId &&
          item.date < endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)
      let countCome = newEntrys.filter((item: EntryItem) => {
        return (
          (item.debet == schet || schet.includes(item.debet)) &&
          (item.debetFirstSubcontoId == firstReferenceId) &&
          item.debetSecondSubcontoId == secondSubcontoId &&
          item.date < endDate
        )
      })
        .reduce((acc, item: EntryItem) => acc + item.count, 0)
      return countCome - countLeave;
  }

  return 0
}