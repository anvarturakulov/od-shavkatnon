import { TypePartners, TypeReference } from 'src/interfaces/reference.interface';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { clientItem } from './clientItem';

export const clients = async(
    data: any,
    startDate: number | null,
    endDate: number | null,
    sectionId: number | null,
    stocksService: StocksService,
    oborotsService: OborotsService
) => {
    
    let result:any[] = [];
    
    let clientsArray:Reference[] = []

    if (data && data.length) {
        clientsArray = data.filter((item: Reference) => {
            return (
                item?.typeReference == TypeReference.PARTNERS &&
                item?.refValues.typePartners == TypePartners.CLIENTS &&
                item?.refValues.clientForSectionId == sectionId
            )
        })
    }

    let days: number[] = []
    let day:number = 0
    if (startDate && endDate) {
        day = startDate
        while (day <= endDate) {
            days.push(day)
            day += 86400000
        }
    }
    // const va
    interface Value {
        count: number,
        summa: number
    }

    const defaultValue: Value = {
        count : 0,
        summa : 0
    }
    let chessTable: Value[][]

    // for (let i=0; i<days.length; i++) {
    //     for (let j=0; j<clientsArray.length; j++) {
    //         chessTable[i][j] = defaultValue
    //     }
    // }
    
   
    // for (const item of filteredData) {
    //     let element = await clientItem(data, startDate, endDate, item.id, item.name, stocksService, oborotsService)
    //     if (Object.keys(element).length) {
    //         result.push(element)
    //     }
    // }
    
    return {
        reportType: 'SKLAD',
        values : [...result]
    }
} 

