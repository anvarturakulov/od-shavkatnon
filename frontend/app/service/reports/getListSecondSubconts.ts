import { EntryItem, Schet } from '@/app/interfaces/report.interface'

export const getListSecondSubconts = (entrys: Array<EntryItem>, arraySchet: Array<Schet>, firstSubcontoId: string): Array<string> => {

  const filteredArray = entrys.filter((elem: EntryItem) => {
    if (firstSubcontoId == null || firstSubcontoId.length == 0) {
      return ( arraySchet.includes(elem.debet) || arraySchet.includes(elem.kredit) )
    } else {
      return (
        (arraySchet.includes(elem.debet) && elem.debetFirstSubcontoId == firstSubcontoId) ||
        (arraySchet.includes(elem.kredit) && elem.kreditFirstSubcontoId == firstSubcontoId)
      )
    }
  })

  const mappedTwinsArray = filteredArray.map((item: EntryItem) => [item.debetSecondSubcontoId, item.kreditSecondSubcontoId])
  const arraySecondSubconts: Array<string> = []
  mappedTwinsArray.forEach((item)=> {
    arraySecondSubconts.push(item[0])
    arraySecondSubconts.push(item[1])
  })

  const setSecondSubconts = new Set<string>(arraySecondSubconts)
  let resultArray: Array<string> = []
  
  setSecondSubconts.forEach((item: string) => resultArray.push(item))

  return resultArray

}