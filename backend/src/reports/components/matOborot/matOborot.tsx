'use client'
import { Sequelize } from 'sequelize-typescript';
import { sklad } from './sklad/sklad';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { start } from 'repl';

export const matOborot = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    section: number | null,
    stocksService: StocksService,
    oborotsService: OborotsService
    ) => {
    
    let result:any[] = [];
    console.log(startDate, endDate)
    let skladResult = await sklad(data, startDate, endDate, section, stocksService, oborotsService)
    result.push(skladResult);

    return result
    
} 