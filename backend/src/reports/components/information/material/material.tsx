import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { materialItem } from './materialItem';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';

export const material = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize ) => {
    
    let result:any[] = [];
    let filteredData:Reference[] = []
    if (data && data.length) {
        filteredData = data.filter((item: Reference) => item?.typeReference == TypeReference.TMZ)
    }

    for (const item of filteredData) {
        let element = await materialItem(data, startDate, endDate, item?.name, item?.id, item?.refValues?.un, sequelize)
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: 'MATERIAL',
        values : [...result]
    }
} 

