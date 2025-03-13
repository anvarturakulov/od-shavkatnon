// import { EntryItem, TypeQuery } from 'src/interfaces/report.interface';

// export const queryOld = (
//   schet: string, 
//   typeQuery: string, 
//   startDate: number | null, 
//   endDate: number | null, 
//   firstSubcontoId: string | undefined, 
//   secondSubcontoId: string | undefined, 
//   globalEntrys: Array<EntryItem> | undefined) => {
  
//   let newEntrys = globalEntrys?.length ? [...globalEntrys] : [] 
  
//   switch (typeQuery) {
//     case TypeQuery.PDKOL:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.debet == schet &&
//           (!firstSubcontoId || item.debetFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.debetSecondSubcontoId == secondSubcontoId) &&
//           item.date < startDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)

//     case TypeQuery.PDSUM:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.debet == schet &&
//           (!firstSubcontoId || item.debetFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.debetSecondSubcontoId == secondSubcontoId) &&
//           item.date < startDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.summa, 0)

//     case TypeQuery.PKKOL:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.kredit == schet &&
//           (!firstSubcontoId || item.kreditFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.kreditSecondSubcontoId == secondSubcontoId) &&
//           item.date < startDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)

//     case TypeQuery.PKSUM:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.kredit == schet &&
//           (!firstSubcontoId || item.kreditFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.kreditSecondSubcontoId == secondSubcontoId) &&
//           item.date < startDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.summa, 0)

//     case TypeQuery.TDKOL:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.debet == schet &&
//           (!firstSubcontoId || item.debetFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.debetSecondSubcontoId == secondSubcontoId) &&
//           item.date >= startDate &&
//           item.date <= endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)

//     case TypeQuery.TDSUM:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.debet == schet &&
//           (!firstSubcontoId || item.debetFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.debetSecondSubcontoId == secondSubcontoId) &&
//           item.date >= startDate &&
//           item.date <= endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.summa, 0)

//     case TypeQuery.TKKOL:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.kredit == schet &&
//           (!firstSubcontoId || item.kreditFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.kreditSecondSubcontoId == secondSubcontoId) &&
//           item.date >= startDate &&
//           item.date <= endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)

//     case TypeQuery.TKSUM:
//       return newEntrys.filter((item: EntryItem) => {
//         return (
//           item.kredit == schet &&
//           (!firstSubcontoId || item.kreditFirstSubcontoId == firstSubcontoId) &&
//           (!secondSubcontoId || item.kreditSecondSubcontoId == secondSubcontoId) &&
//           item.date >= startDate &&
//           item.date <= endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.summa, 0)

//     case TypeQuery.MPRICE:
      
//       let summaL = newEntrys.filter((item: EntryItem) => {
//         return (
//           item.kredit == schet &&
//           item.kreditFirstSubcontoId == firstSubcontoId &&
//           item.kreditSecondSubcontoId == secondSubcontoId &&
//           item.date < endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.summa, 0)
//       let summaC = newEntrys.filter((item: EntryItem) => {
//         return (
//           item.debet == schet &&
//           item.debetFirstSubcontoId == firstSubcontoId &&
//           item.debetSecondSubcontoId == secondSubcontoId &&
//           item.date < endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.summa, 0)

//       let countL = newEntrys.filter((item: EntryItem) => {
//         return (
//           item.kredit == schet &&
//           item.kreditFirstSubcontoId == firstSubcontoId &&
//           item.kreditSecondSubcontoId == secondSubcontoId &&
//           item.date < endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)

//       let countC = newEntrys.filter((item: EntryItem) => {
//         return (
//           item.debet == schet &&
//           item.debetFirstSubcontoId == firstSubcontoId &&
//           item.debetSecondSubcontoId == secondSubcontoId &&
//           item.date < endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)
      
//       let totalCount = countC - countL;
//       let totalSumma = summaC - summaL;
 
//       return totalCount ? +(totalSumma / totalCount).toFixed(5) : 0;

//     case TypeQuery.BALANCE:
//       let countLeave = newEntrys.filter((item: EntryItem) => {
//         return (
//           item.kredit == schet &&
//           item.kreditFirstSubcontoId == firstSubcontoId &&
//           item.kreditSecondSubcontoId == secondSubcontoId &&
//           item.date < endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)
//       let countCome = newEntrys.filter((item: EntryItem) => {
//         return (
//           item.debet == schet &&
//           item.debetFirstSubcontoId == firstSubcontoId &&
//           item.debetSecondSubcontoId == secondSubcontoId &&
//           item.date < endDate
//         )
//       })
//         .reduce((acc, item: EntryItem) => acc + item.count, 0)
//       return countCome - countLeave;
//   }

// }