import { ReferenceModel, TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { skladItem } from './skladItem';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';

export const sklad = (
    data: any,
    startDate: number,
    endDate: number,
    sequelize: Sequelize ) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []

    if (data && data.length) {
        filteredData  = data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES)
                            .filter((item: Reference) => !item?.refValues.markToDeleted)
                            .filter((item: Reference) => {
                                if ( item.refValues.typeSection == TypeSECTION.STORAGE ) return true
                                return false
                            })
    }

    for (const item of filteredData) {
        let element = skladItem(data, startDate, endDate, item.id, item.name, sequelize)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    
    return {
        reportType: 'SKLAD',
        values : [...result]
    }
} 

