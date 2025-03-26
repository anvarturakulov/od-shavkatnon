import { Sequelize } from 'sequelize-typescript';
import { TypeReference } from 'src/interfaces/reference.interface';
import { Reference } from 'src/references/reference.model';
import { personalItem } from './personalItem';
import { Entry } from 'src/entries/entry.model';
import { StocksService } from 'src/stocks/stocks.service';

export const personal = async (
    data: any,
    entries:  Entry[],
    startDate: number | null,
    endDate: number | null,
    workerId: number | null,
    sequelize: Sequelize,
    stocksService: StocksService
) => {
    
    let result:any = [];
    let filteredData:Reference[] = []
    
    if (data && data.length) {
        filteredData = data
                    .filter((item: Reference) => item?.typeReference == TypeReference.WORKERS)
                    .filter((item: Reference) => {
                        if (workerId) {
                            return item.dataValues.id == workerId
                        } else return true
                    })
    }

    console.log('filtered Data', workerId)
   
    for (const item of filteredData) {
        let element = await personalItem(data, entries, startDate, endDate, item.id, sequelize, stocksService)
            if (Object.keys(element).length>0) {
                result.push(element)
            }
    }
    return {
        reportType: 'PERSONAL',
        values : [...result],
    }
} 

