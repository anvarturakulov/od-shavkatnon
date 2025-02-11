import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem } from 'src/interfaces/report.interface';
import { sectionItem } from './sectionItem';
import { Document } from 'src/document/models/document.model';

export const section = (
    sectionType: 'DELIVERY' | 'FILIAL' | 'BUXGALTER' | 'FOUNDER',
    data: any,
    startDate: number,
    endDate: number,
    docs: Document[],
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let result = [];

    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == TypeReference.STORAGES && !item.deleted)
    .filter((item: any) => {
        if (sectionType == 'DELIVERY') return item?.delivery
        if (sectionType == 'FILIAL') return item?.filial
        if (sectionType == 'BUXGALTER') return (item?.buxgalter || item?.director)
        if (sectionType == 'FOUNDER') return ( item?.shavkat || item?.maxsud)
        return false
    })
    .forEach((item: ReferenceModel) => {
        let element = sectionItem(startDate, endDate, item._id, item.name, docs, sectionType ,globalEntrys)
        if (Object.keys(element).length) {
            result.push(element)
        }
    })
    
    return {
        reportType: `SECTION-${sectionType}`,
        values : [...result]
    }
} 

