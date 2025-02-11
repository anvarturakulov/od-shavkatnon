import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem } from 'src/interfaces/report.interface';
import { takingItem } from './takingItem';

export const taking = (
    data: any,
    startDate: number,
    endDate: number,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let result = [];

    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == TypeReference.STORAGES)
    .filter((item: any) => {
        if ( item.filial || item.delivery) return true
        return false
    })
    .forEach((item: ReferenceModel) => {
        let element = takingItem(startDate, endDate, item._id, item.name, globalEntrys)
        if (Object.keys(element).length) {
            result.push(element)
        }
    })
    
    return {
        reportType: 'TAKING',
        values : [...result]
    }
} 

