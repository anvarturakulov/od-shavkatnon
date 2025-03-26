'use client'
import { Sequelize } from 'sequelize-typescript';
import { sklad } from './sklad/sklad';
import { StocksService } from 'src/stocks/stocks.service';

export const matOborot = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    section: number | null,
    sequelize: Sequelize,
    stocksService: StocksService
    ) => {
    
    let result:any[] = [];

    let skladResult = await sklad(data, startDate, endDate, section, sequelize, stocksService)
    result.push(skladResult);

    return result
    
} 