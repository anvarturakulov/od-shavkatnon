import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Entry } from 'src/entries/entry.model';
import { DEBETKREDIT, QuerySimple, TypeQuery } from 'src/interfaces/report.interface';
import { query } from './querys/query';
import { information } from './components/information/information';
import { matOborot } from './components/matOborot/matOborot';
import { ReferencesService } from 'src/references/references.service';
import { DocumentsService } from 'src/documents/documents.service';
import { oborotkaAll } from './components/oborotkaAll/oborotkaAll';
import { EntriesService } from 'src/entries/entries.service';
import { personalAll } from './components/personalAll/personalAll';

@Injectable()
export class ReportsService {

    constructor(
        @InjectModel(Entry) private entryRepository: typeof Entry,
        @InjectConnection() private readonly sequelize: Sequelize,
        private documentsService: DocumentsService,
        private referencesService: ReferencesService,
        private entriesService: EntriesService,
    ) {}


    async getQueryValue(req: QuerySimple) {
        const { typeQuery, schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId} = req;
        return await query(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
    }
    
    async getPriceAndBalance(queryReport: QuerySimple) {
        const { schet, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId } = queryReport;

        let countCome = await query(schet, TypeQuery.COUNTCOME, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        let countLeave = await query(schet, TypeQuery.COUNTLEAVE, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        let totalCome = await query(schet, TypeQuery.TOTALCOME, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        let totalLeave = await query(schet, TypeQuery.TOTALLEAVE, 0, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, this.sequelize)
        
        let totalCount = countCome - countLeave;
        let totalSumma = totalCome - totalLeave;
 
        return {
            price: totalCount ? +(totalSumma / totalCount).toFixed(5) : 0,
            balance: countCome - countLeave
        }
        
    }

    async getInformation(queryInformation: QuerySimple) {
        console.time('References');
        let references = await this.referencesService.getAllReferences();
        console.timeEnd('References');
        console.time('Productions');
        let productions = await this.documentsService.getAllDocuments();
        console.timeEnd('Productions');
        console.time('Deliverys');
        let deliverys = await this.referencesService.getDeliverys();
        console.timeEnd('Deliverys');
        let {startDate, endDate, reportType, firstPrice, secondPrice} = queryInformation;
        console.time('Information');
        let inform = await information(references, startDate, endDate, reportType, firstPrice, secondPrice, productions, deliverys, this.sequelize);
        console.timeEnd('Information');
        return inform;
    }

    async getMatOtchet(queryMatOtchet: QuerySimple) {
        let references = await this.referencesService.getAllReferences();
        let { startDate, endDate, sectionId } = queryMatOtchet;
        let result = matOborot(references, startDate, endDate, sectionId, this.sequelize)
        return result
    }
    
    async getPersonal(queryOborotka: QuerySimple) {
        let references = await this.referencesService.getAllReferences();
        let entrys = await this.entriesService.getAllEntries()
        let { startDate, endDate, firstSubcontoId } = queryOborotka;
        let result = personalAll(references, entrys, startDate, endDate, firstSubcontoId, this.sequelize)
        return result
    }

    async getOborotka(queryOborotka: QuerySimple) {
        let references = await this.referencesService.getAllReferences();
        let entrys = await this.entriesService.getAllEntries();
        let { startDate, endDate, schet } = queryOborotka;
        let result = oborotkaAll(references, entrys, startDate, endDate, schet, this.sequelize)
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
    
}
