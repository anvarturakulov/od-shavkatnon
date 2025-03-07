import { ReferenceModel, TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { sectionItem } from './sectionItem';
import { Document } from 'src/documents/document.model';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';

export const section = async (
    sectionType: 'DELIVERY' | 'FILIAL' | 'BUXGALTER' | 'FOUNDER',
    data: any,
    startDate: number,
    endDate: number,
    docs: Document[],
    sequelize: Sequelize ) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []

    if (data && data.length) {
        filteredData  = data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES && !item.refValues.markToDeleted)
                            .filter((item: Reference) => {
                                if (sectionType == 'DELIVERY') return item.refValues.typeSection == TypeSECTION.DELIVERY
                                if (sectionType == 'FILIAL') return item.refValues.typeSection == TypeSECTION.FILIAL
                                if (sectionType == 'BUXGALTER') return (item.refValues.typeSection == TypeSECTION.ACCOUNTANT 
                                                                    || item.refValues.typeSection == TypeSECTION.DIRECTOR)
                                if (sectionType == 'FOUNDER') return item.refValues.typeSection == TypeSECTION.FOUNDER
                                return false
                            })
    }

    for (const item of filteredData) {
        let element = await sectionItem(startDate, endDate, item.id, item.name, docs, sectionType, sequelize)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: `SECTION-${sectionType}`,
        values : [...result]
    }
} 

