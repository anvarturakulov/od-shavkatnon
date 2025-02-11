import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem } from 'src/interfaces/report.interface';
import { cashItem } from './cashItem';

export const cash = (
    data: any,
    startDate: number,
    endDate: number,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let result = [];

    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == TypeReference.STORAGES && !item.deleted)
    .filter((item: any) => {
        if ( item.buxgalter || item.filial || item.delivery ) return true
        return false
    })
    .forEach((item: ReferenceModel) => {
        let element = cashItem(startDate, endDate, item._id, item.name, globalEntrys)
        // console.log(element)
        if (Object.keys(element).length) {
            result.push(element)
        }
    })
    
    return {
        reportType: 'CASH',
        reportStartDateToBackup: startDate,
        reportEndDateToBackup: endDate,
        values : [...result]
    }
} 

