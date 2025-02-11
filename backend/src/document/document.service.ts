import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocDocument, Document } from './models/document.model';
import { Model } from 'mongoose';
import { CreateDocumentDto } from './dto/document.create.dto';
import { DocumentType } from 'src/interfaces/document.interface';
import { DOCUMENT_IS_PROVEDEN, DOCUMENT_NOT_FOUND_ERROR } from './document.constants';
import { prepareEntrysJournal } from 'src/report/helpers/prepareEntrysJournal';
import { EntryItem, QueryInformation, QueryWorker, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { ReferenceService } from 'src/reference/reference.service';
import { Reference, ReferenceDocument } from 'src/reference/models/referense.model';
import { information } from 'src/report/reports/information/information';
import { writeFileSync } from 'fs';
import TelegramBot from 'node-telegram-bot-api';
import { ReportService } from 'src/report/report.service';
import { query } from 'src/report/helpers/querys/query';

@Injectable()
export class DocumentService {

  constructor(
    @InjectModel(Document.name) private documentModel: Model<DocDocument>,
    private readonly referenceService: ReferenceService,
  ) { }

  public globalEntrys: Array<EntryItem> = []
  public deliverys: Array<ReferenceDocument>
  public founders: Array<ReferenceDocument>
  public startEntrysProcess: boolean = false
  public processIsActive: boolean= false
  public backupProcessIsActive; boolean = false
  public startBackupProcess: boolean = false
  public startBotListining: boolean = false
  

  async createDocument(dto: CreateDocumentDto): Promise<Document> {
    const newDocument = new this.documentModel(dto);
    let result = await newDocument.save()
    return result
  }

  async getByTypeDocument(documentType: DocumentType): Promise<Document[]> {
    return this.documentModel.find({ documentType }).exec()
  }

  async getByTypeForDateDocument(documentType, dateStart: number, dateEnd: number): Promise<Document[]> {
    return this.documentModel.find({ documentType, date: {$gte: dateStart, $lte: dateEnd} }).exec()
  }

  async getForDateDocument(dateStart: number, dateEnd: number): Promise<Document[]> {
    let ret = this.documentModel.find({ date: { $gte: dateStart, $lte: dateEnd } }).exec()
    return ret
  }

  async getAllDocuments(toEntryJournal: boolean): Promise<Document[]> {
    if (toEntryJournal) return this.documentModel.find({ deleted: !true, proveden: true }).exec()
    else return this.documentModel.find({ deleted: !true }).exec()
  }

  async findById(id: string) {
    return this.documentModel.findById(id).exec();
  }

  async markToDelete(id: string, bot: TelegramBot) {
    const document: CreateDocumentDto = await this.documentModel.findOne({ _id: id })
    if (!document.date) {
      throw new NotFoundException(DOCUMENT_NOT_FOUND_ERROR);
    }

    const state = document.deleted ? false : true
    let result = await this.documentModel.updateOne({ _id: id }, { $set: { deleted: state } })
    if (!this.startEntrysProcess) {
      this.startEntrysProcess = true
      let entrys = await this.prepareEntrys()
    }

    if (document.deleted && !this.startBackupProcess) {
      this.startBackupProcess = true
      let backup = await this.backupProcess(bot)
    }

    if (!this.startBotListining) {
      this.startBotListining = true
      this.botListining(bot)
    }

    return result
    
  }

  async setProvodka(id: string) {
    const document: CreateDocumentDto = await this.documentModel.findOne({ _id: id })
    if (document.proveden) {
      throw new NotFoundException(DOCUMENT_IS_PROVEDEN);
    }
    let result = await this.documentModel.updateOne({ _id: id }, { $set: { proveden: true } })
    return result

  }

  async updateById(id: string, dto: CreateDocumentDto) {
    let result = await this.documentModel.updateOne({ _id: id }, { $set: dto })
    return result
  }

  async prepareEntrys() {
    const process = async () => {
      if (!this.processIsActive) {
        this.processIsActive = true
        let result = await this.getAllDocuments(true)
        let founders = await this.referenceService.getFounders()
        let deliverys = await this.referenceService.getDeliverys()
        this.founders = [...founders]
        this.deliverys = [...deliverys]
        this.globalEntrys = [...prepareEntrysJournal(result, founders)];
        this.processIsActive = false
      }
    }
    
    setInterval(process, 12000)
  }

  async backupProcess(bot: TelegramBot) {
    const backup = async () => {
      if (!this.backupProcessIsActive) {
        this.backupProcessIsActive = true
        
        const startDate = Date.now()-86400*1000
        const endDate =  Date.now()
        const reportType =  'All'

        let data = await this.referenceService.getAllReferences();
        let productions = await this.getAllDocuments(true);

        let inform = information(data, startDate, endDate, reportType, {first:4000, second:3300}, this.globalEntrys, productions, this.deliverys)

        const JSONToFile = (obj, filename) => {
          writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));
          console.log('save JSON')
        }

        if (inform) {
          JSONToFile(inform, 'backup');
        }

        bot.sendDocument('842204518', "backup.json")
        bot.sendDocument('1471189320', "backup.json")
        this.backupProcessIsActive = false
      }
    }
    setInterval(backup, 86400000)
  }

  async deleteDocumentByDate(dateStart: number, dateEnd: number): Promise<Document[]> {
    this.documentModel.deleteMany({ date: { $gte: dateStart, $lte: dateEnd } }).exec()
    return null
  }

  async getWorkerInformation(queryWorker: QueryWorker) {
    let { startDate, endDate, workerId, name } = queryWorker;
    console.log('queryWorker -- ', queryWorker)
    let globalEntrys = [...this.globalEntrys]
    console.log('globalEntrys', globalEntrys)

    let result = 
      globalEntrys
      .filter((entry: EntryItem) => {
        return (entry.date >= startDate && entry.date <= endDate)
      })
      .filter((entry: EntryItem) => {
        return (entry.debet == Schet.S67 || entry.kredit == Schet.S67)
      })
      .filter((entry: EntryItem) => {
        return (entry.debetFirstSubcontoId == workerId || entry.kreditFirstSubcontoId == workerId)
      })
    let newArray = []

    if (result.length > 0 ) {
      result.forEach((entry: EntryItem) => {
        let item = {
          date: new Date(entry.date).toLocaleDateString('ru-RU'),
          type: entry.debet == Schet.S67 ? 'ойлик берилди':'иш хаки хисобланди',
          value: entry.summa,
          comment: entry.comment,
          name
        }
        newArray.push(item)
      })
    }
    
    
    const PDSUM = await query(Schet.S67, TypeQuery.PDSUM, startDate, endDate, workerId, '', globalEntrys)
    const PKSUM = await query(Schet.S67, TypeQuery.PKSUM, startDate, endDate, workerId, '', globalEntrys)
    let amount = PKSUM - PDSUM
    
    return {
      amount,
      result: newArray
    }

  }


  async botListining(bot: TelegramBot) {
    bot.on('text', async msg => {
      if (msg.text[0] != '?') return
      let days = 0
      if (msg.text.length > 0) {
        days = + (msg.text.slice(1, msg.text.length))
      }
      // console.log(msg);
      // bot.sendMessage(msg.from.id, msg.text);
      const worker = await this.referenceService.getWorker(`${msg.from.id}`);
      const now:number = Date.now()

      const queryWorker: QueryWorker = {
        startDate: days ? now- (days * 86400*1000 + 1): now, 
        endDate: now, 
        workerId: `${worker[0]._id}`,
        name: worker ? worker[0].name: '',
      }


      const report = await this.getWorkerInformation(queryWorker);
      if (report.result && report.result.length > 0) {
        report.result.forEach(element => {
          bot.sendMessage(msg.from.id, `${element.date} санада:  ${element.value} сум ${element.type}`);  
        });
      }
      if (!days) bot.sendMessage(msg.from.id, `Хурматли ${queryWorker.name} бугунги кунга сизнинг ${report.amount} сум ${report.amount>0? 'пулингиз бор': 'карзингиз бор' }`);
    })
  }

}
