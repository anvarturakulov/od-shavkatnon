import { EntryItem, Schet } from '@/app/interfaces/report.interface'

export const getListFirstSubconts = (entrys: Array<EntryItem>, arraySchet: Array<Schet>): Array<string> => {

  const filteredArray = entrys.filter((elem: EntryItem) => {
    return (arraySchet.includes(elem.debet) || arraySchet.includes(elem.kredit)) 
  })

  const mappedArray = filteredArray.map((item: EntryItem) => {
    return arraySchet.includes(item.debet) ?
      item.debetFirstSubcontoId
      :
      item.kreditFirstSubcontoId
    })
  
  const setSecondSubconts = new Set<string>(mappedArray)
  let resultArray: Array<string> = []
  
  setSecondSubconts.forEach((item: string) => resultArray.push(item))

  return resultArray

}