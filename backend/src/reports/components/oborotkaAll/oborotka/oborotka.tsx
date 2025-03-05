import { EntryItem } from 'src/interfaces/report.interface';
import { oborotkaItem } from './oborotkaItem';

export const oborotka = (
    data: any,
    subcontosList: any,
    startDate: number,
    endDate: number,
    schet: string,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let result = [];
    let firstList = []
    let secondList = []
    if (subcontosList?.firstList && subcontosList?.firstList.length) {
        firstList = [...subcontosList?.firstList]
    }

    if (subcontosList?.secondList && subcontosList?.secondList.length) {
        secondList = [...subcontosList?.secondList]
    }

    firstList && 
    firstList.length > 0 &&
    firstList
    .forEach((firstSubconto: string) => {
        let element = oborotkaItem(data, startDate, endDate, firstSubconto, secondList, schet, globalEntrys)
                
        if (Object.keys(element).length>0) {
            result.push(element)
        }
    })
    
    return {
        reportType: 'OBOROTKA',
        values : [...result],
        startTime: 0,
        endTime: 0,
    }
} 

