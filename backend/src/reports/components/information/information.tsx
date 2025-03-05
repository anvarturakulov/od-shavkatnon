'use client'
import { EntryItem, FoydaPrice } from 'src/interfaces/report.interface';
// import { Section } from './section/section';
import { cash } from './cash/cash';
import { taking } from './taking/taking';
import { section } from './section/section';
import { sklad } from './sklad/sklad';
import { foyda } from './foyda/foyda';
import { norma } from './norma/norma';
import { Document } from 'src/document/models/document.model';
import { ReferenceDocument } from 'src/reference/models/referense.model';
import { material } from './material/material';
import { financial } from './financial/financial';
import { giving } from './giving/giving';
import { debitorKreditor } from './debitorKreditor/debitorKreditor';


export const information = (
    data: any,
    startDate: number,
    endDate: number,
    reportType: string,
    foydaPrice: FoydaPrice,
    globalEntrys: Array<EntryItem> | undefined,
    docs: Document[],
    deliverys: ReferenceDocument[]
    ) => {
    
    let result = [];
    
    if (reportType == 'Financial' || reportType == 'All') {
        let financialResult = financial(data, startDate, endDate, globalEntrys)
        result.push({'reportType': 'FINANCIAL', 'values': financialResult});
    }
    if (reportType == 'Foyda' || reportType == 'All') {
        let foydaResult = foyda(data, startDate, endDate, foydaPrice, globalEntrys, docs, deliverys)
        result.push(foydaResult);
    }
    if (reportType == 'Cash' || reportType == 'All') {
        let cashResult = cash(data, startDate, endDate, globalEntrys)
        result.push(cashResult);
    }
    if (reportType == 'Taking' || reportType == 'All') {
        let takingResult = taking(data, startDate, endDate, globalEntrys)
        result.push(takingResult);
    }
    if (reportType == 'Giving' || reportType == 'All') {
        let givingResult = giving(data, startDate, endDate, globalEntrys)
        result.push(givingResult);
    }
    if (reportType == 'Section-buxgalter' || reportType == 'All') {
        let sectionBuxResult = section('BUXGALTER', data, startDate, endDate, docs,  globalEntrys )
        result.push(sectionBuxResult);
    }
    if (reportType == 'Section-filial' || reportType == 'All') {
        let sectionFilResult = section('FILIAL', data, startDate, endDate, docs, globalEntrys)
        result.push(sectionFilResult);
    }
    if (reportType == 'Section-delivery' || reportType == 'All') {
        let sectionDelResult = section('DELIVERY', data, startDate, endDate, docs, globalEntrys)
        result.push(sectionDelResult);
    }
    if (reportType == 'Sklad' || reportType == 'All') {
        let skladResult = sklad(data, startDate, endDate, globalEntrys)
        result.push(skladResult);
    }
    if (reportType == 'Norma' || reportType == 'All') {
        let normaResult = norma(data, startDate, endDate, globalEntrys)
        result.push(normaResult);
    }
    if (reportType == 'Material' || reportType == 'All') {
        let materialResult = material(data, startDate, endDate, globalEntrys)
        result.push(materialResult); 
    }
    if (reportType == 'Section-founder' || reportType == 'All') {
        let sectionFounderResult = section('FOUNDER', data, startDate, endDate, docs, globalEntrys)
        result.push(sectionFounderResult);
    }

    if (reportType == 'DebitorKreditor' || reportType == 'All') {
        let debitorKreditorResult = debitorKreditor(data, startDate, endDate, globalEntrys)
        result.push({'reportType': 'DEBITORKREDITOR', 'values': debitorKreditorResult});
    }
    // let productionResult = production(data, startDate, endDate, globalEntrys, hamirs)
    // result.push(productionResult);
    
    // let zpResult = zp(data, startDate, endDate, globalEntrys, hamirs)
    // result.push(zpResult);

    return result
    
} 