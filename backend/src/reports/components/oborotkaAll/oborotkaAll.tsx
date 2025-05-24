'use client'
import { EntryItem, Schet } from 'src/interfaces/report.interface';
import { oborotka } from './oborotka/oborotka';
import { Entry } from 'src/entries/entry.model';
import { Sequelize } from 'sequelize-typescript';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

const getSubcontosList = (entrys: Array<Entry> | undefined, schet: string | null) => {
    let newEntrys = (entrys != undefined && entrys.length) ? [...entrys] : []
    let firstList = new Set<number | null>();
    let secondList = new Set<number | null>();
    let thirdList = new Set<number | null>();
    
    newEntrys.filter((item: Entry) => {
        return (String(item.debet) == schet || String(item.kredit) == schet)
    }).forEach((item: Entry) => {
        if (item.debet == schet) {
            firstList.add(item.debetFirstSubcontoId)
            secondList.add(item.debetSecondSubcontoId)
            thirdList.add(item.debetThirdSubcontoId)
        }
        if (item.kredit == schet) {
            firstList.add(item.kreditFirstSubcontoId)
            secondList.add(item.kreditSecondSubcontoId)
            thirdList.add(item.kreditSecondSubcontoId)
        }
    })
    return {
        firstList: [...firstList],
        secondList: [...secondList],
        thirdList: [...thirdList]

    }
}

export const oborotkaAll = async (
    data: any,
    entrys: Entry[] | undefined,
    startDate: number | null,
    endDate: number | null,
    schet: Schet | null,
    stocksService: StocksService,
    oborotsService: OborotsService
    ) => {
    
    let result:any[] = [];
    let subcontosList = getSubcontosList(entrys, schet)
    // console.log(schet)
    // console.log(subcontosList)

    let oborotkaResult = await oborotka(data, subcontosList, startDate, endDate, schet, stocksService, oborotsService)
    result.push(oborotkaResult);
        
    return {...oborotkaResult}
    
} 