import { Sequelize } from 'sequelize-typescript';
import { oborotkaItem } from './oborotkaItem';
import { Schet } from 'src/interfaces/report.interface';

export const oborotka = async (
    data: any,
    subcontosList: any,
    startDate: number | null,
    endDate: number | null,
    schet: Schet | null,
    sequelize: Sequelize ) => {
    
    let result:any = [];
    let firstList:number[] = []
    let secondList:number[] = []
    
    if (subcontosList?.firstList && subcontosList?.firstList.length) {
        firstList = [...subcontosList?.firstList]
    }

    if (subcontosList?.secondList && subcontosList?.secondList.length) {
        secondList = [...subcontosList?.secondList]
    }
    
    let startTime = Date.now()
    
    if (firstList && firstList.length) {
        for (const firstSubcontoId of firstList) {
            let element = await oborotkaItem(data, startDate, endDate, firstSubcontoId, secondList, schet, sequelize)
            if (Object.keys(element).length>0) {
                result.push(element)
            }
        }
    }
    
    let endTime = Date.now()
    
    return {
        reportType: 'OBOROTKA',
        values : [...result],
        startTime: startTime,
        endTime: endTime,
    }
} 

