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
import { taking } from "./takingTry-Change/taking";
import { Reference } from "src/references/reference.model";
import { StocksService } from "src/stocks/stocks.service";
import { OborotsService } from "src/oborots/oborots.service";
import { DocumentsService } from "src/documents/documents.service";

export const information = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    reportType: string | null,
    deliverys: Reference[],
    sequelize: Sequelize,
    stocksService: StocksService,
    oborotsService: OborotsService,
    documentsService: DocumentsService
    ) => {
    
    let result:any[] = [];
    
    if (reportType == 'Financial' || reportType == 'All') {
        let financialResult = await financial(data, startDate, endDate, oborotsService)
        result.push({'reportType': 'FINANCIAL', 'values': financialResult});
    }

    if (reportType == 'Foyda' || reportType == 'All') {
        let foydaResult = await foyda(data, startDate, endDate, sequelize, deliverys, stocksService, oborotsService, documentsService)
        result.push(foydaResult);
    }

    if (reportType == 'Cash' || reportType == 'All') {
        let cashResult = await cash(data, startDate, endDate, stocksService, oborotsService)
        result.push(cashResult);
    }

    if (reportType == 'Taking' || reportType == 'All') {
        let takingResult = await taking(data, startDate, endDate, oborotsService)
        result.push(takingResult);
    }

    if (reportType == 'Giving' || reportType == 'All') {
        let givingResult = await giving(data, startDate, endDate, oborotsService)
        result.push(givingResult);
    }

    if (reportType == 'Section-buxgalter' || reportType == 'All') {
        let sectionBuxResult = await section('BUXGALTER', data, startDate, endDate, stocksService, oborotsService )
        result.push(sectionBuxResult);
    }
    if (reportType == 'Section-filial' || reportType == 'All') {
        let sectionFilResult = await section('FILIAL', data, startDate, endDate, stocksService, oborotsService)
        result.push(sectionFilResult);
    }

    if (reportType == 'Section-delivery' || reportType == 'All') {
        let sectionDelResult = await section('DELIVERY', data, startDate, endDate, stocksService, oborotsService)
        result.push(sectionDelResult);
    }

    if (reportType == 'Sklad' || reportType == 'All') {
        let skladResult = await sklad(data, startDate, endDate, stocksService, oborotsService)
        result.push(skladResult);
    }

    if (reportType == 'Norma' || reportType == 'All') {
        let normaResult = await norma(data, startDate, endDate, oborotsService)
        result.push(normaResult);
    }

    if (reportType == 'Material' || reportType == 'All') {
        let materialResult = await material(data, startDate, endDate, oborotsService)
        result.push(materialResult); 
    }

    if (reportType == 'Section-founder' || reportType == 'All') {
        let sectionFounderResult = await section('FOUNDER', data, startDate, endDate, stocksService, oborotsService)
        result.push(sectionFounderResult);
    }

    if (reportType == 'DebitorKreditor' || reportType == 'All') {
        let debitorKreditorResult = await debitorKreditor(data, startDate, endDate, stocksService, oborotsService)
        result.push({'reportType': 'DEBITORKREDITOR', 'values': debitorKreditorResult});
    }

    // let productionResult = production(data, startDate, endDate, globalEntrys, hamirs)
    // result.push(productionResult);
    
    // let zpResult = zp(data, startDate, endDate, globalEntrys, hamirs)
    // result.push(zpResult);

    return result
    
} 