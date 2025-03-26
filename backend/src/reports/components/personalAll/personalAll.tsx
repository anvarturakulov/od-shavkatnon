'use client'
import { Schet } from 'src/interfaces/report.interface';
import { personal } from './personal/personal';
import { Sequelize } from 'sequelize-typescript';
import { Entry } from 'src/entries/entry.model';
import { StocksService } from 'src/stocks/stocks.service';

export const personalAll = async (
    data: any,
    entries: Entry[],
    startDate: number | null,
    endDate: number | null,
    workerId: number | null,
    sequelize: Sequelize,
    stocksService: StocksService
    ) => {
    
    let result:any[] = [];

    let personalResult = await personal(data, entries, startDate, endDate, workerId, sequelize, stocksService)
    result.push(personalResult);
        
    return {...personalResult}
    
} 