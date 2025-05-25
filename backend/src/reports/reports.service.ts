import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Entry } from 'src/entries/entry.model';
import { DEBETKREDIT, QuerySimple, QueryWorker, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { query } from './querys/query';
import { information } from './components/information/information';
import { matOborot } from './components/matOborot/matOborot';
import { ReferencesService } from 'src/references/references.service';
import { oborotkaAll } from './components/oborotkaAll/oborotkaAll';
import { EntriesService } from 'src/entries/entries.service';
import { personalAll } from './components/personalAll/personalAll';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { Document } from 'src/documents/document.model';
import { DocValues } from 'src/docValues/docValues.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocumentsService } from 'src/documents/documents.service';
import { clients } from './components/clients/clients';

@Injectable()
export class ReportsService {

    constructor(
        @InjectModel(Entry) private entryRepository: typeof Entry,
        @InjectConnection() private readonly sequelize: Sequelize,
        @InjectModel(Document) private documentRepository: typeof Document,
        private referencesService: ReferencesService,
        private entriesService: EntriesService,
        private stocksService: StocksService,
        private oborotsService: OborotsService,
        private documentsService: DocumentsService
    ) {}

    async getAllDocumentsByType(documentType) {
        // const documents = await this.documentsService.getAllDocumentsByType(documentType)
        // return documents;
        const documents = await this.documentRepository.findAll({
            where: { documentType },
            include: [DocValues, DocTableItems],
          });
          return documents;
    }

    async getQueryValue(req: QuerySimple) {
        const { typeQuery, schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId} = req;
        return await query(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.stocksService, this.oborotsService)
    }
    
    async getPriceAndBalance(queryReport: QuerySimple) {
        const { schet, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId } = queryReport;

        let countCome = await query(schet, TypeQuery.COUNTCOME, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.stocksService, this.oborotsService)
        let countLeave = await query(schet, TypeQuery.COUNTLEAVE, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.stocksService, this.oborotsService)
        let totalCome = await query(schet, TypeQuery.TOTALCOME, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.stocksService, this.oborotsService)
        let totalLeave = await query(schet, TypeQuery.TOTALLEAVE, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.stocksService, this.oborotsService)
        
        let totalCount = countCome - countLeave;
        let totalSumma = totalCome - totalLeave;
 
        return {
            price: totalCount ? +(totalSumma / totalCount).toFixed(5) : 0,
            balance: countCome - countLeave
        }
        
    }

    async getInformation(queryInformation: QuerySimple) {
        let references = await this.referencesService.getAllReferences();
        let deliverys = await this.referencesService.getDeliverys();
        let {startDate, endDate, reportType} = queryInformation;
        console.time('Information');
        let inform = await information(references, startDate, endDate, reportType, deliverys, this.sequelize, this.stocksService, this.oborotsService, this.documentsService);
        console.timeEnd('Information');
        return inform;
    }

    async getMatOtchet(queryMatOtchet: QuerySimple) {
        let references = await this.referencesService.getAllReferences();
        let { startDate, endDate, sectionId } = queryMatOtchet;
        let result = matOborot(references, startDate, endDate, sectionId, this.stocksService, this.oborotsService)
        return result
    }
    
    async getPersonal(queryOborotka: QuerySimple) {
        let references = await this.referencesService.getAllReferences();
        let entrys = await this.entriesService.getAllEntries()
        let { startDate, endDate, firstSubcontoId } = queryOborotka;
        let result = personalAll(references, entrys, startDate, endDate, firstSubcontoId, this.stocksService, this.oborotsService)
        return result
    }

    async getOborotka(queryOborotka: QuerySimple) {
        let references = await this.referencesService.getAllReferencesFromBase();
        // console.time('Get Entries');
        let entrys = await this.entriesService.getAllEntries();
        // console.timeEnd('Get Entries');
        let { startDate, endDate, schet } = queryOborotka;
        // console.time('Oborotka');
        let result = oborotkaAll(references, entrys, startDate, endDate, schet, this.stocksService, this.oborotsService)
        // console.timeEnd('Oborotka');
        return result
    }

    async getAnalitic(queryAnalitic: QuerySimple) {
        let { startDate, endDate, schet, firstSubcontoId, secondSubcontoId, thirdSubcontoId, dk } = queryAnalitic;
        let entrys = await this.entriesService.getAllEntries();
        if (startDate && endDate && schet) {
            const result = entrys
                    .filter((entry: Entry) => {
                        return (
                            Number(entry.dataValues.date) >= startDate && 
                            Number(entry.dataValues.date) <= endDate
                        )
                    })
                    .filter((entry: Entry) => {
                        if (dk == DEBETKREDIT.DEBET) {
                            return (
                                entry.dataValues.debet == schet && 
                                entry.dataValues.debetFirstSubcontoId == firstSubcontoId && 
                                entry.dataValues.debetSecondSubcontoId == secondSubcontoId &&
                                entry.dataValues.debetThirdSubcontoId == null
                            )
                        }
                        else 
                            return (
                                entry.dataValues.kredit == schet && 
                                entry.dataValues.kreditFirstSubcontoId == firstSubcontoId && 
                                entry.dataValues.kreditSecondSubcontoId == secondSubcontoId &&
                                entry.dataValues.kreditThirdSubcontoId == null
                            )
                    })
            return result
        }
        
    }

    async getClients(queryMatOtchet: QuerySimple) {
        let references = await this.referencesService.getAllReferences();
        let { startDate, endDate, sectionId } = queryMatOtchet;
        console.log('SECTION ID', sectionId)
        let result = clients(references, startDate, endDate, sectionId, this.stocksService, this.oborotsService)
        return result
    }

        
}
