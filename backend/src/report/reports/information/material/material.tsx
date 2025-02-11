import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem } from 'src/interfaces/report.interface';
import { materialItem } from './materialItem';

export const material = (
    data: any,
    startDate: number,
    endDate: number,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let result = [];

    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == TypeReference.TMZ)
    .forEach((item: ReferenceModel) => {
        let element = materialItem(data, startDate, endDate, item.name, item._id, item.un, globalEntrys)
        if (Object.keys(element).length) {
            result.push(element)
        }
    })
    
    return {
        reportType: 'MATERIAL',
        values : [...result]
    }
} 

