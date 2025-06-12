import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize'; // Импорт из sequelize
import { Document } from './document.model';
import { DocValues } from 'src/docValues/docValues.model';
import { DocTableItems } from 'src/docTableItems/docTableItems.model';
import { DocSTATUS, DocumentType } from 'src/interfaces/document.interface';
import { UpdateCreateDocumentDto } from './dto/updateCreateDocument.dto';
import { Entry } from 'src/entries/entry.model';
import { prepareEntrysList } from './helper/entry/prepareEntrysList';
import { convertJsonDocs } from './helper/entry/convertJsonDoc';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';
import { ReferencesService } from 'src/references/references.service';
import { QueryWorker, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { UsersService } from 'src/users/users.service';
import { sendMessage } from './helper/entry/sendMessage';
import { Op } from 'sequelize'; // Используем импорт вместо require
import { query } from 'src/reports/querys/query';
import { EntriesService } from 'src/entries/entries.service';
import { BackupService } from 'src/backup/backup.service';
import { DuplicateDocs } from './dto/duplicateDocs.dto';

@Injectable()
export class DocumentsService {
  private foundersIds: string[];
  private startBotListining: boolean = false;

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
    private entriesService: EntriesService
  ) {
    const myArrayString = this.configService.get<string>('FOUNDERS_IDS');
    this.foundersIds = myArrayString ? myArrayString.split('|') : [];
  }

  // Методы чтения остаются без изменений
  async getAllDocuments() {
    const documents = await this.documentRepository.findAll({ include: [DocValues, DocTableItems] });
    return documents;
  }

  async getAllDocumentsByType(documentType) {
    const documents = await this.documentRepository.findAll({
      where: { documentType },
      include: [DocValues, DocTableItems],
    });
    return documents;
  }

  async getAllDocumentsByTypeForDate(documentType, dateStart: number, dateEnd: number) {
    const documents = await this.documentRepository.findAll({
      where: {
        documentType,
        date: {
          [Op.gte]: dateStart,
          [Op.lte]: dateEnd,
        },
      },
      include: [DocValues, DocTableItems],
    });
    return documents;
  }

  
async getAllOrdersForDate(order:boolean, dateStart: number, dateEnd: number) {
    
    let whereClouse:any = {
      documentType: DocumentType.Order,
      date: {
        [Op.gte]: dateStart,
        [Op.lte]: dateEnd,
      },
    };

    const include:any = [
      { model: DocValues },
      { model: DocTableItems },
    ];

    if (order == true) {
      whereClouse = {
        documentType: DocumentType.Order,
      };
      include[0] = {
        model: DocValues,
        where: {
          orderTakingDate: {
            [Op.gte]: dateStart,
            [Op.lte]: dateEnd,
          },
        },
      };
    }

    const documents = await this.documentRepository.findAll({
      where: whereClouse,
      include,
    });

    return documents;
  }


  async getAllDocsByDate(dateStart: number, dateEnd: number) {
    const documents = await this.documentRepository.findAll({
      where: {
        date: {
          [Op.gte]: dateStart,
          [Op.lte]: dateEnd,
        },
      },
      include: [DocValues, DocTableItems],
    });
    return documents;
  }

  async getDocumentById(id: number) {
    const document = await this.documentRepository.findOne({
      where: { id },
      include: [DocValues, DocTableItems],
    });
    return document;
  }

  // Обновлённая функция updateDocumentById с транзакциями
  async updateDocumentById(id: number, dto: UpdateCreateDocumentDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const document = await this.documentRepository.findOne({
        where: { id },
        include: [DocValues, DocTableItems],
        transaction,
      });

      if (!document) {
        throw new Error(`Document with id ${id} not found`);
      }

      // Обновляем основные поля документа
      await document.update({ date: dto.date }, { transaction });

      // Обновляем или создаём DocValues
      if (document.docValues) {
        await document.docValues.update({ ...dto.docValues }, { transaction });
      } else {
        await this.docValuesRepository.create(
          { ...dto.docValues, docId: document.id },
          { transaction }
        );
      }

      // Удаляем старые элементы таблицы и создаём новые
      await this.docTableItemsRepository.destroy({ where: { docId: document.id }, transaction });

      const items = [...dto.docTableItems];
      if (items.length > 0 && items[0].analiticId !== null) {
        await Promise.all(
          items.map(item =>
            this.docTableItemsRepository.create(
              { ...item, docId: document.id },
              { transaction }
            )
          )
        );
      }

      await transaction.commit();
      return document;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  async updateHamirsById(id: number, count: number, analiticId) {
    const transaction = await this.sequelize.transaction();
    try {
      const document = await this.documentRepository.findOne({
        where: { id },
        include: [DocValues, DocTableItems],
        transaction,
      });

      if (!document) {
        throw new Error(`Document with id ${id} not found`);
      }

      if (document.docValues) {
        await document.docValues.update({ count, analiticId }, { transaction });
      } 
      await transaction.commit();
      return document;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  async createDocument(dto: UpdateCreateDocumentDto, usersSer: UsersService, refSer: ReferencesService, bot: TelegramBot) {
    const transaction = await this.sequelize.transaction();
    try {
      const document = await this.documentRepository.create(
        {
          date: dto.date,
          documentType: dto.documentType,
          docStatus: DocSTATUS.OPEN,
          userId: dto.userId ? dto.userId : 0,
        },
        { transaction }
      );

      await this.docValuesRepository.create(
        {
          ...dto.docValues,
          docId: document.id,
        },
        { transaction }
      );

      const items = [...dto.docTableItems];
      if (items?.length && items[0]?.analiticId !== -1) {
        await Promise.all(
          items.map(item =>
            this.docTableItemsRepository.create(
              {
                ...item,
                docId: document.id,
              },
              { transaction }
            )
          )
        );
      }

      if (dto.docStatus === DocSTATUS.PROVEDEN) {
        const doc = await this.documentRepository.findOne({
          where: { id: document.id },
          include: [DocValues, DocTableItems],
          transaction,
        });

        if (!doc) {
          throw new Error('Document not found after creation');
        }

        const entrysList = prepareEntrysList(doc, this.foundersIds, true);

        if (entrysList.length > 0) {
          for (const item of entrysList) {
            // console.log('Processing entry:', JSON.stringify(item, null, 2)); // Логирование для отладки
            const entry = await this.entryRepository.create(
              { ...item },
              { transaction }
            );
            if (!entry) {
              throw new Error('Failed to create entry');
            }

            const stockEntries = await this.stocksService.addTwoEntries(entry, transaction);
            if (stockEntries === undefined) {
              throw new Error('Failed to add stock entries');
            }
        
            const tmzEntry = await this.stocksService.addEntrieToTMZ(entry, transaction);
            if (tmzEntry === undefined) {
              throw new Error('Failed to add TMZ entry');
            }
        
            const oborotEntry = await this.oborotsService.addEntry(entry, transaction);
            if (!oborotEntry) {
              throw new Error('Failed to add oborot entry');
            }
          }
        }


        await doc.update({ docStatus: DocSTATUS.PROVEDEN }, { transaction });
      }

      if (dto.docStatus === DocSTATUS.PROVEDEN) {
        await sendMessage(dto, true, usersSer, refSer, bot);
      }

      await transaction.commit();
      return document;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  // Обновлённая функция markToDeleteById с транзакциями
  async markToDeleteById(id: number, bot: TelegramBot) {
    const transaction = await this.sequelize.transaction();
    if (!transaction) {
      throw new Error('Failed to create transaction');
    }
    try {
      const document = await this.documentRepository.findOne({
        where: { id },
        include: [Entry, DocValues, DocTableItems],
        transaction,
      });

      if (!document) {
        throw new Error(`Document with id ${id} not found`);
      }

      let newStatus: DocSTATUS = DocSTATUS.DELETED;
      if (document.docStatus === DocSTATUS.DELETED) {
        newStatus = DocSTATUS.OPEN;
      } else if (document.docStatus === DocSTATUS.OPEN) {
        newStatus = DocSTATUS.DELETED;
      } else if (document.docStatus === DocSTATUS.PROVEDEN) {
        newStatus = DocSTATUS.DELETED;

        // Удаляем проводки
        const entrysList = await this.entryRepository.findAll({
          where: { docId: document.id },
          transaction,
        });
        if (entrysList.length > 0) {
          // console.log(entrysList)

          for (const entry of entrysList) {
            await this.stocksService.deleteTwoEntries(entry, transaction);
            await this.stocksService.deleteEntrieToTMZ(entry, transaction);
            await this.oborotsService.deleteEntry(entry, transaction);
          }

          const entriesToDelete = await this.entryRepository.findAll({ where: { docId: document.id }, transaction });
          const deletedRows = await this.entryRepository.destroy({ where: { docId: document.id }, transaction });
          if (deletedRows !== entriesToDelete.length) {
            throw new Error(`Expected to delete ${entriesToDelete.length} entries, but deleted ${deletedRows}`);
          }
        }
      }

      // await document.update({ docStatus: newStatus }, { transaction });
      
      await document.update({ docStatus: newStatus }, { transaction });
      // Проверяем, обновился ли статус (опционально)
      await document.reload({ transaction });
      if (document.docStatus !== newStatus) {
        throw new Error(`Failed to update document status for document with id ${id}`);
      }

      await transaction.commit();
      if (!this.startBotListining) {
        this.startBotListining = true;
        this.botListining(bot);
      }
      return document;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to mark document for deletion: ${error.message}`);
    }
  }

  // Обновлённая функция markToDeleteById с транзакциями
  async deleteComeProduct(dateStart: number, dateEnd: number) {
    const transaction = await this.sequelize.transaction();
    try {
      
      const documents = await this.documentRepository.findAll({
        where: {
          date: {
            [Op.gte]: dateStart,
            [Op.lte]: dateEnd,
          },
          documentType: DocumentType.ComeProduct
        },
        include: [DocValues, DocTableItems],
      });

      for (const doc of documents) {
        if (doc.docStatus != DocSTATUS.PROVEDEN) {
          if (!doc.docValues.count) {
            // Удаляем связанные записи
            await DocValues.destroy({ where: { docId: doc.id } });
            await DocTableItems.destroy({ where: { docId: doc.id } });
            // Удаляем сам документ
            await doc.destroy();
          }
          
        }
      }

      await transaction.commit();
      return documents;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed for deletion: ${error.message}`);
    }
  }

  // Обновлённая функция setProvodka с транзакциями
 async setProvodka(id: number) {
  const transaction = await this.sequelize.transaction();
  try {
    const document = await this.documentRepository.findOne({
      where: { id },
      transaction,
      lock: transaction.LOCK.UPDATE, // Блокировка на таблице documents
    });

    if (!document) {
      throw new Error(`Document with id ${id} not found`);
    }

    if (document.docStatus === DocSTATUS.PROVEDEN) {
      throw new Error(`Document with id ${id} is already proved`);
    }
    

    const documentWithRelations = await this.documentRepository.findOne({
      where: { id },
      include: [
        { model: DocValues }, // Опционально, если DocValues тоже может быть null
        { model: DocTableItems }, // Опционально для DocTableItems
      ],
      transaction,
    });

    if (!documentWithRelations) {
      throw new Error(`Document with id ${id} not found`);
    }

    const entrysList = prepareEntrysList(documentWithRelations, this.foundersIds, true);

    const entries = await this.entryRepository.findAll({ where: { docId: document.id }, transaction });

    if (entries.length > 0) {
      throw new Error(`Document with id ${id} is already has entries`);
    }

    if (entrysList.length > 0 && !entries.length) {
      for (const item of entrysList) {
        const entry = await this.entryRepository.create(
          { ...item },
          { transaction }
        );
        await this.stocksService.addTwoEntries(entry, transaction);
        await this.stocksService.addEntrieToTMZ(entry, transaction);
        await this.oborotsService.addEntry(entry, transaction);
      }
    }

    await document.update({ docStatus: DocSTATUS.PROVEDEN }, { transaction });

    await transaction.commit();
    return document;
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Failed to set provodka: ${error.message}`);
  }
}

  // Обновлённая функция createMany с транзакциями
  async createMany(list: any[]) {
    const transaction = await this.sequelize.transaction();
    try {
      if (!list || !list.length) {
        throw new Error('No documents provided to create');
      }

      const documents = await Promise.all(
        list.map(async item => {
          const dto = convertJsonDocs(item);
          const document = await this.documentRepository.create(
            {
              date: dto.date,
              documentType: dto.documentType,
              docStatus: dto.docStatus,
              userId: dto.userId ? dto.userId : 0,
            },
            { transaction }
          );

          await this.docValuesRepository.create(
            {
              ...dto.docValues,
              docId: document.id,
            },
            { transaction }
          );

          const items = [...dto.docTableItems];
          if (items.length > 0 && items[0].analiticId !== -1) {
            await Promise.all(
              items.map(item =>
                this.docTableItemsRepository.create(
                  {
                    ...item,
                    docId: document.id,
                  },
                  { transaction }
                )
              )
            );
          }

          return document;
        })
      );

      await transaction.commit();
      return documents;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to create multiple documents: ${error.message}`);
    }
  }

  // Обновлённая функция pereProvodka с транзакциями
  async pereProvodka() {
    try {
      const documents = await this.documentRepository.findAll({
        include: [DocValues, DocTableItems],
      });
  
      for (const document of documents) {
        const transaction = await this.sequelize.transaction(); // Новая транзакция для каждой итерации
        try {
          if (document.docStatus === DocSTATUS.PROVEDEN) {
            // Создаём новые проводки
            const newEntrysList = prepareEntrysList(document, this.foundersIds, true);
            if (newEntrysList.length > 0) {
              await Promise.all(
                newEntrysList.map(async item => {
                  const entry = await this.entryRepository.create(
                    { ...item },
                    { transaction }
                  );
                  await this.stocksService.addTwoEntries(entry, transaction);
                  await this.stocksService.addEntrieToTMZ(entry, transaction);
                  await this.oborotsService.addEntry(entry, transaction);
                })
              );
            } else {
              throw new Error(`No entries generated for document with senderId: ${document.docValues.senderId}`);
            }
  
            // await document.update({ docStatus: DocSTATUS.PROVEDEN }, { transaction });
          }
  
          await transaction.commit(); // Завершаем транзакцию для текущего документа
        } catch (error) {
          await transaction.rollback(); // Откатываем только текущую транзакцию
          console.error(`Failed to process document ${document.id}: ${error.message}`);
          // Можно продолжить цикл или выбросить ошибку
          // continue; // Продолжаем с следующим документом
        }
      }
  
      console.log('Pereprovodka tugadi =============== >>>>>> ========= >>>>>');
      return documents;
    } catch (error) {
      throw new Error(`Failed to re-prove documents: ${error.message}`);
    }
  }

  async getWorkerInformation(queryWorker: QueryWorker) {
    const { startDate, endDate, workerId, name } = queryWorker;
    const entrys = await this.entriesService.getAllEntries();
    let result = 
        entrys
        .filter((entry: Entry) => {
            return (
                (entry.date >= startDate && entry.date <= endDate) &&
                (entry.debet == Schet.S67 || entry.kredit == Schet.S67) &&
                (entry.debetFirstSubcontoId == workerId || entry.kreditFirstSubcontoId == workerId)
            )
        })
        
      
    const newArray = result
        // .sort((a: Entry, b: Entry) => Number(a.date) - Number(b.date)) // Сортировка по дате
        .map((entry: Entry) => ({
            date: Number(entry.date),
            type: entry.debet == Schet.S67 ? 'ойлик берилди' : 'иш хаки хисобланди',
            value: entry.total,
            comment: entry.description,
            name,
        }));

    const POSUM = await query(Schet.S67, TypeQuery.POSUM, startDate, endDate, workerId, null, null, this.stocksService, this.oborotsService)
    let amount = (-1)*POSUM
    
    return {
      amount,
      result: newArray
    }

  }


  // Метод botListining остаётся без изменений
  botListining(bot: TelegramBot) {
    bot.on('text', async msg => {
      if (msg.text && msg.text[0] !== '?') return;
      let days = 0;
      if (msg.text && msg.text.length > 0) {
        days = +(msg.text.slice(1, msg.text.length));
      }

      const worker = msg.from && (await this.referencesService.getWorker(`${msg.from.id}`));
      const now: number = Date.now();
      if (worker && msg.from) {
        const queryWorker: QueryWorker = {
          startDate: days ? now - (days * 86400 * 1000 + 1) : now,
          endDate: now,
          workerId: worker.id,
          name: worker ? worker.name : '',
        };

        const report = await this.getWorkerInformation(queryWorker);
        if (report.result && report.result.length > 0 && msg.from) {
          const sortedArray = report.result.sort((a, b) => a.date - b.date);
          // console.log(sortedArray);

          sortedArray.forEach(element => {
            if (msg.from) {
              bot.sendMessage(
                msg.from.id,
                `${new Date(element.date).toLocaleDateString('ru-RU')} санада: ${element.value} сум ${element.type}`
              );
            }
          });
        }
        if (!days)
          bot.sendMessage(
            msg.from.id,
            `Хурматли ${queryWorker.name} бугунги кунга сизнинг ${report.amount} сум ${
              report.amount > 0 ? 'пулингиз бор' : 'карзингиз бор'
            }`
          );
      }
    });
  }


  async duplicateDocsByTypeForDate(dto: DuplicateDocs) {

    const documentsFrom = await this.documentRepository.findAll({
      where: {
        documentType: dto.documentType,
        date: {
          [Op.gte]: dto.dateFrom,
          [Op.lte]: dto.dateFrom,
        },
      },
      include: [DocValues, DocTableItems],
    });

    // console.log('documentsFrom.length -- ',documentsFrom.length)

    const documentsTo = await this.documentRepository.findAll({
      where: {
        documentType: dto.documentType,
        date: {
          [Op.gte]: dto.dateTo,
          [Op.lte]: dto.dateTo,
        },
        docStatus: DocSTATUS.OPEN || DocSTATUS.PROVEDEN 
      },
      include: [DocValues, DocTableItems],
    });

    if (documentsTo && documentsTo.length) return

    // console.log('documentsTo.length -- ',documentsTo.length)

    const transaction = await this.sequelize.transaction();
    try {

      const documents = await Promise.all(
        documentsFrom.map(async item => {
          // const dto = convertJsonDocs(item);
          const document = await this.documentRepository.create(
            {
              date: dto.dateTo,
              documentType: dto.documentType,
              docStatus: DocSTATUS.OPEN,
              userId: dto.userId ? dto.userId : 0,
            },
          );

          const { id, ...rest } = item.docValues.get({ plain: true }) || {};

          const docValues = await this.docValuesRepository.create(
            {
              ...rest,
              docId: document.id,
              cashFromPartner: 100
            },
          );

          // console.log('docValues -- ', docValues)

          const items = [...item.docTableItems];
          if (items.length > 0 && items[0].analiticId !== -1) {
            await Promise.all(
              items.map(item =>
                this.docTableItemsRepository.create(
                  {
                    ...item,
                    docId: document.id,
                  },
                )
              )
            );
          }
          document.save()
          return document;
        })
      );
  
      await transaction.commit();
      return documents;
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to set provodka: ${error.message}`);
    }
    
  }

}

