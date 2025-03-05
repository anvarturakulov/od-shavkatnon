import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocValues } from 'src/docValues/docValues.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { Sequelize } from 'sequelize-typescript';
import { Entry } from 'src/entries/entry.model';
import { QuerySimple } from 'src/interfaces/report.interface';

@Injectable()
export class ReportsService {

    constructor(
        private readonly sequelize: Sequelize,
        @InjectModel(Document) private documentRepository: typeof Document,
        @InjectModel(DocValues) private docValuesRepository: typeof DocValues,
        @InjectModel(DocTableItems) private docTableItemsRepository: typeof DocTableItems,
        @InjectModel(Entry) private entryRepository: typeof Entry
    ) {}


    async getQueryValue(queryReport: QuerySimple) {
        const { typeQuery, schet, startDate, endDate, firstSubcontoId, secondSubcontoId} = queryReport;
        return query(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, this.documentService.globalEntrys)
    }
    
    async getPriceAndBalance(queryReport: QuerySimple) {
        const { schet, endDate, firstSubcontoId, secondSubcontoId } = queryReport;
        let result = {
            price: 0,
            balance: 0
        }

        result.price = query(schet, TypeQuery.MPRICE, 0, endDate, firstSubcontoId, secondSubcontoId, this.documentService.globalEntrys)
        result.balance = query(schet, TypeQuery.BALANCE, 0, endDate, firstSubcontoId, secondSubcontoId, this.documentService.globalEntrys)
        
        return result
    }

    async getInformation(queryInformation: QuerySimple) {
        let data = await this.referencesService.getAllReferences();
        let productions = await this.documentService.getAllDocuments(true);
        let {startDate, endDate, reportType, foydaPrice} = queryInformation;
        // let allEntrys = await this.documentService.prepareEntrys()
        let inform = information(data, startDate, endDate, reportType, foydaPrice, this.documentService.globalEntrys, productions, this.documentService.deliverys )
        return inform
    }

    async getMatOtchet(queryMatOtchet: QuerySimple) {
        let data = await this.referenceService.getAllReferences();
        let { startDate, endDate, section } = queryMatOtchet;
        let result = matOborot(data, startDate, endDate, section, this.documentService.globalEntrys)
        return result
    }

    async getOborotka(queryOborotka: QuerySimple) {
        let data = await this.referenceService.getAllReferences();
        let { startDate, endDate, schet } = queryOborotka;
        let result = oborotkaAll(data, startDate, endDate, schet, this.documentService.globalEntrys)
        return result
    }

    async getAnalitic(queryAnalitic: QuerySimple) {
        let { startDate, endDate, schet, firstSubcontoId, secondSubcontoId, dk } = queryAnalitic;
        let globalEntrys = [...this.documentService.globalEntrys]

        let result = 
            globalEntrys
            .filter((entry: EntryItem) => {
            return (entry.date >= startDate && entry.date <= endDate)
            })
            .filter((entry: EntryItem) => {
            if (dk == 'debet') {
                return (entry.debet >= schet && entry.debetFirstSubcontoId == firstSubcontoId && entry.debetSecondSubcontoId == secondSubcontoId)
            }
            else return (entry.kredit >= schet && entry.kreditFirstSubcontoId == firstSubcontoId && entry.kreditSecondSubcontoId == secondSubcontoId)
        })
        return result
    }
    
}
