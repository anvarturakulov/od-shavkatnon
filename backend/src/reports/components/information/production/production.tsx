import { ReferenceModel, TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { productionItem } from './productionItem';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';

export const production = (
    data: any,
    startDate: number,
    endDate: number,
    sequelize: Sequelize,
    hamirs: [] ) => {
    
        // Anvar hamir bilan hato bor chog'i
    let result:any[] = [];
    let filteredData:Reference[] = []

    if (data && data.length) {
        filteredData  = data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES)
                            .filter((item: Reference) => {
                                if ( item.refValues.typeSection == TypeSECTION.FILIAL ) return true
                                return false
                            })
    }   

    for (const item of filteredData) {
        let element = productionItem(startDate, endDate, item?.id, item.name, sequelize, hamirs)

        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: 'PRODUCTION',
        values : [...result]
    }
} 

