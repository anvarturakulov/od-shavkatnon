import { Sequelize } from 'sequelize-typescript';
import { TypeReference } from 'src/interfaces/reference.interface';
import { Schet } from 'src/interfaces/report.interface';
import { Reference } from 'src/references/reference.model';
import { personalItem } from './personalItem';
import { Entry } from 'src/entries/entry.model';

export const personal = async (
    data: any,
    entries:  Entry[],
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize ) => {
    
    let result:any = [];
    let filteredData:Reference[] = []
    let secondList:number[] = []
    
    if (data && data.length) {
        filteredData = data.filter((item: any) => item?.typeReference == TypeReference.STORAGES)
    }
   
    for (const item of filteredData) {
        let element = await personalItem(data, entries, startDate, endDate, item.id, sequelize)
            if (Object.keys(element).length>0) {
                result.push(element)
            }
    }

    return {
        reportType: 'PERSONAL',
        values : [...result],
    }
} 

