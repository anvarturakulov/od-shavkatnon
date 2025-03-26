'use client'

import { Sequelize } from "sequelize-typescript";
import { cash } from "./cash/cash";
import { debitorKreditor } from "./debitorKreditor/debitorKreditor";
import { financial } from "./financial/financial";
import { foyda } from "./foyda/foyda";
import { giving } from "./giving/giving";
import { material } from "./material/material";
import { norma } from "./norma/norma";
import { section } from "./section/section";
import { sklad } from "./sklad/sklad";
import { taking } from "./takingNoActive/taking";
import { Document } from "src/documents/document.model";
import { Reference } from "src/references/reference.model";
import { StocksService } from "src/stocks/stocks.service";

export const information = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    reportType: string | null,
    firstPrice: number | null,
    secondPrice: number | null,
    deliverys: Reference[],
    sequelize: Sequelize,
    stocksService: StocksService
    ) => {
    
    let result:any[] = [];
    
    if (reportType == 'Financial' || reportType == 'All') {
        let financialResult = await financial(data, startDate, endDate, sequelize)
        result.push({'reportType': 'FINANCIAL', 'values': financialResult});
    }
    if (reportType == 'Foyda' || reportType == 'All') {
        let foydaResult = await foyda(data, startDate, endDate, firstPrice, secondPrice, sequelize, deliverys, stocksService)
        result.push(foydaResult);
    }
    if (reportType == 'Cash' || reportType == 'All') {
        let cashResult = await cash(data, startDate, endDate, sequelize, stocksService)
        result.push(cashResult);
    }
    if (reportType == 'Taking' || reportType == 'All') {
        let takingResult = await taking(data, startDate, endDate, sequelize)
        result.push(takingResult);
    }
    if (reportType == 'Giving' || reportType == 'All') {
        let givingResult = await giving(data, startDate, endDate, sequelize)
        result.push(givingResult);
    }
    if (reportType == 'Section-buxgalter' || reportType == 'All') {
        let sectionBuxResult = await section('BUXGALTER', data, startDate, endDate,  sequelize, stocksService )
        result.push(sectionBuxResult);
    }
    if (reportType == 'Section-filial' || reportType == 'All') {
        let sectionFilResult = await section('FILIAL', data, startDate, endDate, sequelize, stocksService)
        result.push(sectionFilResult);
    }
    if (reportType == 'Section-delivery' || reportType == 'All') {
        let sectionDelResult = await section('DELIVERY', data, startDate, endDate, sequelize, stocksService)
        result.push(sectionDelResult);
    }
    if (reportType == 'Sklad' || reportType == 'All') {
        let skladResult = await sklad(data, startDate, endDate, sequelize, stocksService)
        result.push(skladResult);
    }
    if (reportType == 'Norma' || reportType == 'All') {
        let normaResult = await norma(data, startDate, endDate, sequelize)
        result.push(normaResult);
    }
    if (reportType == 'Material' || reportType == 'All') {
        let materialResult = await material(data, startDate, endDate, sequelize)
        result.push(materialResult); 
    }
    if (reportType == 'Section-founder' || reportType == 'All') {
        let sectionFounderResult = await section('FOUNDER', data, startDate, endDate, sequelize, stocksService)
        result.push(sectionFounderResult);
    }

    if (reportType == 'DebitorKreditor' || reportType == 'All') {
        let debitorKreditorResult = await debitorKreditor(data, startDate, endDate, sequelize, stocksService)
        result.push({'reportType': 'DEBITORKREDITOR', 'values': debitorKreditorResult});
    }


    // let productionResult = production(data, startDate, endDate, globalEntrys, hamirs)
    // result.push(productionResult);
    
    // let zpResult = zp(data, startDate, endDate, globalEntrys, hamirs)
    // result.push(zpResult);

    return result
    
} 