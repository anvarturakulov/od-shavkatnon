import { Sequelize } from 'sequelize-typescript';
import { givingItem } from './givingItem';

export const giving = async (
    data: any,
    startDate: number,
    endDate: number,
    sequelize: Sequelize ) => {
    
    let result:any[] = [];

    if (data && data.length) {
        for (const item of data) {
            let element = await givingItem(startDate, endDate, item?.id, item.name, sequelize)
            if (Object.keys(element).length) {
                result.push(element)
            }
        }
    }    
    
    return {
        reportType: 'GIVING',
        values : [...result]
    }
} 

