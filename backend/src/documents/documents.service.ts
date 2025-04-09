import { Injectable, Inject } from '@nestjs/common';
import { Document } from './document.model';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { DocValues } from 'src/docValues/docValues.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocSTATUS, DocumentType } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from './dto/updateCreateDocument.dto';
import { Sequelize } from 'sequelize-typescript';
import { Entry } from 'src/entries/entry.model';
import { prepareEntrysList } from './helper/entry/prepareEntrysList';
import { console } from 'inspector';
import { convertJsonDocs } from './helper/entry/convertJsonDoc';
import { Stock } from 'src/stocks/stock.model';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { ReferencesService } from 'src/references/references.service';
import { ReportsService } from 'src/reports/reports.service';
import { QueryWorker } from 'src/interfaces/report.interface';
import { UsersService } from 'src/users/users.service';
import { sendMessage } from './helper/entry/sendMessage';
const { Op } = require('sequelize');
const fs = require('fs');

@Injectable()
export class DocumentsService {
    private foundersIds: string[];

    constructor(
        @InjectConnection() private readonly sequelize: Sequelize,
        @InjectModel(Document) private documentRepository: typeof Document,
        @InjectModel(DocValues) private docValuesRepository: typeof DocValues,
        @InjectModel(DocTableItems) private docTableItemsRepository: typeof DocTableItems,
        @InjectModel(Entry) private entryRepository: typeof Entry,
        private stocksService: StocksService,
        private oborotsService: OborotsService,
        private configService: ConfigService,
        private referencesService: ReferencesService,
        private reportsService: ReportsService
    ) {
        const myArrayString = this.configService.get<string>('FOUNDERS_IDS'); 
        this.foundersIds = myArrayString ? myArrayString.split('|') : []; 
    }

    private startBotListining: boolean = false

    async getAllDocuments() {
        const documents = await this.documentRepository.findAll({include: [DocValues, DocTableItems ]})
        return documents
    }

    async getAllDocumentsByType(documentType: DocumentType) {
        const documents = await this.documentRepository.findAll({where: {documentType}, include: [DocValues, DocTableItems]})
        return documents
    }

    async getAllDocumentsByTypeForDate(documentType, dateStart: number, dateEnd: number) {
        
        const documents = await this.documentRepository.findAll(
            {
                where: {
                        documentType, 
                        date: { 
                            [Op.gte]: dateStart,
                            [Op.lte]: dateEnd
                        },
                    }, 
                include: [DocValues, DocTableItems]
            }
        )
        return documents 
    }

    async getAllDocsByDate(dateStart: number, dateEnd: number) {
        
        const documents = await this.documentRepository.findAll(
            {
                where: {
                        date: { 
                            [Op.gte]: dateStart,
                            [Op.lte]: dateEnd
                        },
                    }, 
                include: [DocValues, DocTableItems]
            }
        )
        return documents 
    }

    async getDocumentById(id: number) {
        const document = await this.documentRepository.findOne({where: {id}, include: [DocValues, DocTableItems]})
        return document
    }

    async updateDocumentById(id: number, dto:UpdateCreateDocumentDto) {
        const document = await this.documentRepository.findOne({where: {id}, include: [DocValues, DocTableItems]})
    
        const transaction = await this.sequelize.transaction();
        try {
            if (document) {
                document.date = dto.date
                
                if (document.docValues) {
                    await document.docValues.update({ ...dto.docValues });
                } else {
                    await this.docValuesRepository.create({ ...dto.docValues, docId: document.id });
                }

                await document.save()
                await this.docTableItemsRepository.destroy({where: {docId:document.id}})

                const items = [...dto.docTableItems]

                // if (items && items.length > 0 && items[0].analiticId != -1 ) {
                //     for (const item of items) {
                //         const docTableItem = await this.docTableItemsRepository.create({
                //             ...item,
                //             docId: document.id
                //         })
                //     }
                // }

                if (items && items.length > 0 && items[0].analiticId != null) {
                    await Promise.all(
                        items.map(item =>
                            this.docTableItemsRepository.create({
                                ...item,
                                docId: document.id,
                            })
                        )
                    );
                }

            }

            await transaction.commit();
            return document

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async createDocument(dto:UpdateCreateDocumentDto, usersSer:UsersService, refSer: ReferencesService, bot: TelegramBot) {
        
        const transaction = await this.sequelize.transaction();
        try {
            const document = await this.documentRepository.create({
                date:dto.date, 
                documentType: dto.documentType, 
                docStatus: DocSTATUS.OPEN,
                userId: dto.userId ? dto.userId: 0
            })

            const docValues = await this.docValuesRepository.create({
                ...dto.docValues,
                docId: document.id
            })

            const items = [...dto.docTableItems]

            if (items && items.length > 0 && items[0].analiticId != -1 ) {
                for (const item of items) {
                    const docTableItem = await this.docTableItemsRepository.create({
                        ...item,
                        docId: document.id
                    })
                }
            }

            if (dto.docStatus == DocSTATUS.PROVEDEN) {
                const doc = await this.documentRepository.findOne({where: {id: document.id}, include: [DocValues, DocTableItems]})
                if (doc) {
                    const entrysList = [...prepareEntrysList(doc, this.foundersIds, true)]
                    if (entrysList.length > 0 ) {
                        for (const item of entrysList) {
                            const entry = await this.entryRepository.create({
                                ...item,
                            })
                            // create new stock and update
                            await this.stocksService.addTwoEntries(entry)
                            await this.stocksService.addEntrieToTMZ(entry)
                            await this.oborotsService.addEntry(entry)
                        }
                    }
                    doc.docStatus = DocSTATUS.PROVEDEN
                    await doc.save()
                    sendMessage(dto, true, usersSer, refSer, bot)
                }
                
            }

            await transaction.commit();
            return document

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }

    async markToDeleteById(id: number, bot: TelegramBot) {
        
        const document = await this.documentRepository.findOne({where: {id}, include: [Entry]})
        const transaction = await this.sequelize.transaction();
        
        try {
            let newStatus: DocSTATUS = DocSTATUS.DELETED
            if (document) {
                if (document.docStatus == DocSTATUS.DELETED) newStatus = DocSTATUS.OPEN
                if (document.docStatus == DocSTATUS.OPEN) newStatus = DocSTATUS.DELETED
                if (document.docStatus == DocSTATUS.PROVEDEN) newStatus = DocSTATUS.DELETED
                
                // restore stock by deleted entrys
                const entrysList = await this.entryRepository.findAll({where: {docId:document.id}})
                if ( entrysList.length > 0 ) {
                    for (const entry of entrysList) {
                        // destroy stock by deleted entry
                        await this.stocksService.deleteTwoEntries(entry)
                        await this.stocksService.deleteEntrieToTMZ(entry)
                        await this.oborotsService.deleteEntry(entry)
                    }
                }

                // Anvar Bu erda Entrys ni uchirish kodini ham yozish kerak
                await this.entryRepository.destroy({where: {docId:document.id}})

                // if (document.docStatus == DocSTATUS.DELETED && !this.startBackupProcess) {
                //     this.startBackupProcess = true
                //     let backup = await this.backupProcess(bot)
                // }
              
                if (!this.startBotListining) {
                    this.startBotListining = true
                    this.botListining(bot)
                }

                document.docStatus = newStatus
                await document.save()
            }
                await transaction.commit();
                return document

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    }

    async setProvodka(id: number) {
        const document = await this.documentRepository.findOne({where: {id}, include: [{ all: true }]})
        const transaction = await this.sequelize.transaction();
        try {
            if (document && document.docStatus != DocSTATUS.PROVEDEN) {
                const entrysList = [...prepareEntrysList(document, this.foundersIds)]
                if (entrysList.length > 0 ) {
                    for (const item of entrysList) {
                        const entry = await this.entryRepository.create({
                            ...item,
                        })
                        // create new stock and update
                        await this.stocksService.addTwoEntries(entry)
                        await this.stocksService.addEntrieToTMZ(entry)
                        await this.oborotsService.addEntry(entry)
                    }
                }
                document.docStatus = DocSTATUS.PROVEDEN
                await document.save()
            }

            await transaction.commit();
            return document

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async createMany(list: any) {
        
        // const transaction = await this.sequelize.transaction();
        
        if (list && list.length) {
            for (const item of list) {
                let element = convertJsonDocs(item)
                const dto = {...element}
                try {
                    const document = await this.documentRepository.create({
                        date:dto.date, 
                        documentType: dto.documentType, 
                        docStatus: dto.docStatus,
                        userId: dto.userId ? dto.userId: 0
                    })
                    const docValues = await this.docValuesRepository.create({
                        ...dto.docValues,
                        docId: document.id
                    })
        
                    const items = [...dto.docTableItems]
        
                    if (items && items.length > 0 && items[0].analiticId != -1 ) {
                        for (const item of items) {
                            const docTableItem = await this.docTableItemsRepository.create({
                                ...item,
                                docId: document.id
                            })
                        }
                    }
        
                    
                    // await transaction.commit();
        
                } catch (err) {
                    // await transaction.rollback();
                    throw new Error(`Failed to create documents: ${err.message}`);
                }
            }
        }
        
    }


    async pereProvodka() {
        const documents = await this.documentRepository.findAll({include: [DocValues, DocTableItems ]})
        for (const document of documents) {
            if (document && document.docStatus != DocSTATUS.DELETED) {
                document.docStatus = DocSTATUS.PROVEDEN
                await document.save()
                await this.entryRepository.destroy({where: {docId:document.id}})
                
                const entrysList = [...prepareEntrysList(document, this.foundersIds, true)]
                if (entrysList.length > 0 ) {
                    for (const item of entrysList) {
                        const entry = await this.entryRepository.create({
                            ...item,
                        })
                        await this.stocksService.addTwoEntries(entry)
                        await this.stocksService.addEntrieToTMZ(entry)
                        await this.oborotsService.addEntry(entry)
                    }

                } else throw new Error(`Entrys not: ${document.docValues.senderId}`);

            }
        }
        
    }

    botListining(bot: TelegramBot) {
        bot.on('text', async msg => {
          if (msg.text && msg.text[0] != '?') return
          let days = 0
          if (msg.text && msg.text.length > 0) {
            days = + (msg.text.slice(1, msg.text.length))
          }
          
          const worker = msg.from && await this.referencesService.getWorker(`${msg.from.id}`);
          console.log('Worker ----************',worker, days)
          const now:number = Date.now()
          if (worker && msg.from) {
            const queryWorker: QueryWorker = {
                startDate: days ? now- (days * 86400*1000 + 1): now, 
                endDate: now, 
                workerId: worker.id,
                name: worker ? worker.name: '',
              }
        
              const report = await this.reportsService.getWorkerInformation(queryWorker);
              if (report.result && report.result.length > 0 && msg.from) {
                
                const sortedArray = report.result.sort((a, b) => a.date - b.date)
                console.log(sortedArray)

                sortedArray.forEach(element => {
                  if (msg.from) {
                      bot.sendMessage(msg.from.id, `${new Date(element.date).toLocaleDateString('ru-RU')} санада:  ${element.value} сум ${element.type}`);  
                  }
                });
              }
              if (!days) bot.sendMessage(msg.from.id, `Хурматли ${queryWorker.name} бугунги кунга сизнинг ${report.amount} сум ${report.amount>0? 'пулингиз бор': 'карзингиз бор'}--${days}`);
            
          }})
      }
}
