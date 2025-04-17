import { TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { skladItem } from './skladItem';
import { Reference } from 'src/references/reference.model';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

export const sklad = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    stocksService: StocksService,
    oborotsService: OborotsService
) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []
    
    if (data && data.length) {
        filteredData  = data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES)
        .filter((item: Reference) => !item?.refValues.markToDeleted)
        .filter((item: Reference) => {
            if ( item.refValues.typeSection == TypeSECTION.STORAGE || item.refValues.typeSection == TypeSECTION.FILIAL  ) return true
                                return false
                            })
    }
    
    console.log('Bu erga ham keldi -- ', filteredData)
    // console.log()
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

