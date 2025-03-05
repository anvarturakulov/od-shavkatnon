'use client'
import { EntryItem } from 'src/interfaces/report.interface';
import { oborotka } from './oborotka/oborotka';

const getSubcontosList = (entrys: Array<EntryItem> | undefined, schet: string) => {
    let newEntrys = (entrys != undefined && entrys.length) ? [...entrys] : []
    let firstList = new Set();
    let secondList = new Set();
    
    newEntrys.filter((item: EntryItem) => {
        return (String(item.debet) == schet || String(item.kredit) == schet)
    }).forEach((item: EntryItem) => {
        if (item.debet == schet) {
            firstList.add(item.debetFirstSubcontoId)
            secondList.add(item.debetSecondSubcontoId)
        }
        if (item.kredit == schet) {
            firstList.add(item.kreditFirstSubcontoId)
            secondList.add(item.kreditSecondSubcontoId)
        }
    })
    return {
        firstList: [...firstList],
        secondList: [...secondList]
    }
}

export const oborotkaAll = (
    data: any,
    startDate: number,
    endDate: number,
    schet: string,
    globalEntrys: Array<EntryItem> | undefined
    ) => {
    
    let result = [];
    let subcontosList = getSubcontosList(globalEntrys, schet)

    let skladResult = oborotka(data, subcontosList, startDate, endDate, schet, globalEntrys)
    result.push(skladResult);
        
    return {...skladResult}
    // return result
    // return subcontosList
    
} 