import { Reference } from 'src/references/reference.model';
import { givingItem } from './givingItem';
import { OborotsService } from 'src/oborots/oborots.service';
import { TypeReference } from 'src/interfaces/reference.interface';

export const giving = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    oborotsService: OborotsService
    ) => {
    
    let result:any[] = [];
    let filteredData:any[] = []

    if (data && data.length > 0 ) {
        filteredData = data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES && !item.refValues.markToDeleted)
    }
        
    for (const item of filteredData) {
        let element = await givingItem(startDate, endDate, item?.id, item.name, oborotsService)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }

    return {
        reportType: 'GIVING',
        values : [...result]
    }
} 

