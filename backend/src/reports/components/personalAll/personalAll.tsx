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
    workerId: number | null,
    sequelize: Sequelize
    ) => {
    
    let result:any[] = [];

    let personalResult = await personal(data, entries, startDate, endDate, workerId, sequelize)
    result.push(personalResult);
        
    return {...personalResult}
    
} 