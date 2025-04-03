import { ReferenceModel, TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { takingItem } from './takingItem';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { OborotsService } from 'src/oborots/oborots.service';

export const taking = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    oborotsService: OborotsService
    ) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []

    if (data && data.length) {
        filteredData =  data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES)
                            .filter((item: Reference) => {
                                if ( item.refValues.typeSection == TypeSECTION.FILIAL ||
                                     item.refValues.typeSection == TypeSECTION.DELIVERY) return true
                                return false
        })
    }
    
    for (const item of filteredData) { 
        let element = await takingItem(startDate, endDate, item.id, item.name, oborotsService)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: 'TAKING',
        values : [...result]
    }
} 

