import { TypeReference } from 'src/interfaces/reference.interface';
import { skladItem } from './skladItem';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

export const sklad = async(
    data: any,
    startDate: number | null,
    endDate: number | null,
    section: number | null,
    stocksService: StocksService,
    oborotsService: OborotsService
) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []

    if (data && data.length) {
        filteredData = data.filter((item: any) => item?.typeReference == TypeReference.STORAGES)
    }
   
    for (const item of filteredData) {
        let element = await skladItem(data, startDate, endDate, item.id, item.name, stocksService, oborotsService)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: 'SKLAD',
        values : [...result]
    }
} 

