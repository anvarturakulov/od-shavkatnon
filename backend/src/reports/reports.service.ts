import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocValues } from 'src/docValues/docValues.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { Sequelize } from 'sequelize-typescript';
import { Entry } from 'src/entries/entry.model';
import { QuerySimple, TypeQuery } from 'src/interfaces/report.interface';
import { query } from './querys/query';
import { information } from './components/information/information';

@Injectable()
export class ReportsService {

    constructor(
        @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
        @InjectModel(Document) private documentRepository: typeof Document,
        @InjectModel(DocValues) private docValuesRepository: typeof DocValues,
        @InjectModel(DocTableItems) private docTableItemsRepository: typeof DocTableItems,
        @InjectModel(Entry) private entryRepository: typeof Entry
    ) {}


    async getQueryValue(req: QuerySimple) {
        const { typeQuery, schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId} = req;

        return await query(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
  
    }
    
    async getPriceAndBalance(queryReport: QuerySimple) {
        const { schet, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId } = queryReport;
        let result = {
            price: 0,
            balance: 0
        }

        let countCome = await query(schet, TypeQuery.COUNTCOME, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        let countLeave = await query(schet, TypeQuery.COUNTLEAVE, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        let totalCome = await query(schet, TypeQuery.TOTALCOME, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        let totalLeave = await query(schet, TypeQuery.TOTALLEAVE, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        
        let totalCount = countCome - countLeave;
        let totalSumma = totalCome - totalLeave;
 
        return totalCount ? +(totalSumma / totalCount).toFixed(5) : 0;
        
    }

    async getInformation(queryInformation: QuerySimple) {
        let data = await this.getAllReferences();
        let productions = await this.documentService.getAllDocuments(true);
        let {startDate, endDate, reportType, firstPrice, secondPrice} = queryInformation;
        // let allEntrys = await this.documentService.prepareEntrys()
        let inform = information(data, startDate, endDate, reportType, foydaPrice, this.documentService.globalEntrys, productions, this.documentService.deliverys )
        return inform
    }

    // async getMatOtchet(queryMatOtchet: QuerySimple) {
    //     let data = await this.referenceService.getAllReferences();
    //     let { startDate, endDate, section } = queryMatOtchet;
    //     let result = matOborot(data, startDate, endDate, section, this.documentService.globalEntrys)
    //     return result
    // }

    // async getOborotka(queryOborotka: QuerySimple) {
    //     let data = await this.referencesService.getAllReferences();
    //     let { startDate, endDate, schet } = queryOborotka;
    //     let result = oborotkaAll(data, startDate, endDate, schet, this.documentService.globalEntrys)
    //     return result
    // }

    // async getAnalitic(queryAnalitic: QuerySimple) {
    //     let { startDate, endDate, schet, firstSubcontoId, secondSubcontoId, dk } = queryAnalitic;
    //     let globalEntrys = [...this.documentService.globalEntrys]

    //     let result = 
    //         globalEntrys
    //         .filter((entry: EntryItem) => {
    //         return (entry.date >= startDate && entry.date <= endDate)
    //         })
    //         .filter((entry: EntryItem) => {
    //         if (dk == 'debet') {
    //             return (entry.debet >= schet && entry.debetFirstSubcontoId == firstSubcontoId && entry.debetSecondSubcontoId == secondSubcontoId)
    //         }
    //         else return (entry.kredit >= schet && entry.kreditFirstSubcontoId == firstSubcontoId && entry.kreditSecondSubcontoId == secondSubcontoId)
    //     })
    //     return result
    // }
    
}
