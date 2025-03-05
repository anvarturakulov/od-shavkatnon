import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem } from 'src/interfaces/report.interface';
import { givingItem } from './givingItem';

export const giving = (
    data: any,
    startDate: number,
    endDate: number,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let result = [];

    data && 
    data.length > 0 &&
    data
    // .filter((item: any) => item?.typeReference == TypeReference.STORAGES)
    // .filter((item: any) => {
    //     if ( item.buxgalter) return true
    //     return false
    // })
    .forEach((item: ReferenceModel) => {
        let element = givingItem(startDate, endDate, item._id, item.name, globalEntrys)
        if (Object.keys(element).length) {
            result.push(element)
        }
    })
    
    return {
        reportType: 'GIVING',
        values : [...result]
    }
} 

