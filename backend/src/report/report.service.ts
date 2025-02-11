import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocDocument, Document } from '../document//models/document.model';
import { DocumentService } from 'src/document/document.service';
import { query } from './helpers/querys/query';
import { EntryItem, QueryAnalitic, QueryInformation, QueryMatOtchet, QueryObject, QueryOborotka, QueryWorker, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { ReferenceService } from 'src/reference/reference.service';
import { information } from './reports/information/information';
import { HamirService } from 'src/hamir/hamir.service';
import { matOborot } from './reports/matOborot/matOborot';
import { oborotkaAll } from './reports/oborotkaAll/oborotkaAll';

@Injectable()
export class ReportService {
  constructor(@InjectModel(Document.name) private documentModel: Model<DocDocument>,
    
    private readonly documentService: DocumentService,
    private readonly referenceService: ReferenceService,
    private readonly hamirService: HamirService,
  ) { }

  async getEntrysJournal() {
    let result = await this.documentService.globalEntrys
    return result
  }

  async getQueryValue(queryReport: QueryObject) {
    const { typeQuery, schet, startDate, endDate, firstSubcontoId, secondSubcontoId} = queryReport;
    return query(schet, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, this.documentService.globalEntrys)
  }

  async getPriceAndBalance(queryReport: QueryObject) {
    const { schet, endDate, firstSubcontoId, secondSubcontoId } = queryReport;
    let result = {
      price: 0,
      balance: 0
    }

    result.price = query(schet, TypeQuery.MPRICE, 0, endDate, firstSubcontoId, secondSubcontoId, this.documentService.globalEntrys)
    result.balance = query(schet, TypeQuery.BALANCE, 0, endDate, firstSubcontoId, secondSubcontoId, this.documentService.globalEntrys)
    
    return result
  }

  async getInformation(queryInformation: QueryInformation) {
    let data = await this.referenceService.getAllReferences();
    let productions = await this.documentService.getAllDocuments(true);
    let {startDate, endDate, reportType, foydaPrice} = queryInformation;
    // let allEntrys = await this.documentService.prepareEntrys()
    let inform = information(data, startDate, endDate, reportType, foydaPrice, this.documentService.globalEntrys, productions, this.documentService.deliverys )
    return inform
  }

  async getMatOtchet(queryMatOtchet: QueryMatOtchet) {
    let data = await this.referenceService.getAllReferences();
    let { startDate, endDate, section } = queryMatOtchet;
    let result = matOborot(data, startDate, endDate, section, this.documentService.globalEntrys)
    return result
  }

  async getOborotka(queryOborotka: QueryOborotka) {
    let data = await this.referenceService.getAllReferences();
    let { startDate, endDate, schet } = queryOborotka;
    let result = oborotkaAll(data, startDate, endDate, schet, this.documentService.globalEntrys)
    return result
  }

  async getAnalitic(queryAnalitic: QueryAnalitic) {
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
