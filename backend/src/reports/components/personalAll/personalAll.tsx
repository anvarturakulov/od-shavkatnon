'use client'
import { Schet } from 'src/interfaces/report.interface';
import { personal } from './personal/personal';
import { Sequelize } from 'sequelize-typescript';
import { Entry } from 'src/entries/entry.model';

export const personalAll = async (
    data: any,
    entries: Entry[],
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize
    ) => {
    
    let result:any[] = [];

    let oborotkaResult = await personal(data, entries, startDate, endDate, sequelize)
    result.push(oborotkaResult);
        
    return {...oborotkaResult}
    
} 