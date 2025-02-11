'use client'
import { EntryItem } from 'src/interfaces/report.interface';
import { sklad } from './sklad/sklad';

export const matOborot = (
    data: any,
    startDate: number,
    endDate: number,
    section: string,
    globalEntrys: Array<EntryItem> | undefined
    ) => {
    
    let result = [];

    let skladResult = sklad(data, startDate, endDate, section, globalEntrys)
    result.push(skladResult);

    return result
    
} 