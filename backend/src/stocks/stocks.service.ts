import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize, Transaction, Op } from 'sequelize'; // Импорт из sequelize
import { Stock } from './stock.model';
import { EntryCreationAttrs } from 'src/entries/entry.model';
import { DEBETKREDIT, Schet } from 'src/interfaces/report.interface';

@Injectable()
export class StocksService {
  private schetsWithOneSubconto = [Schet.S40, Schet.S50, Schet.S60, Schet.S66, Schet.S67, Schet.S68];

  constructor(
    @InjectModel(Stock) private stockRepository: typeof Stock,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  private checkEntryForDublicate(entry: EntryCreationAttrs) {
    return entry.debet === entry.kredit && entry.debetFirstSubcontoId === entry.kreditFirstSubcontoId;
  }

  private getWhereClause(
    schet: Schet,
    date: bigint,
    firstSubcontoId: number | null,
    secondSubcontoId: number | null
  ) {
    const where: any = { schet, date, firstSubcontoId };
    if (!this.schetsWithOneSubconto.includes(schet)) {
      where.secondSubcontoId = secondSubcontoId;
    } else {
      where.secondSubcontoId = null;
    }
    return where;
  }

  async addEntry(
    schet: Schet,
    date: bigint,
    firstSubcontoId: number | null,
    secondSubcontoId: number | null,
    count: number,
    total: number,
    debetKredit: DEBETKREDIT,
    comment: string,
    transaction?: Transaction,
  ): Promise<Stock> {
    try {
      const where = this.getWhereClause(schet, date, firstSubcontoId, secondSubcontoId);
      const [stock, created] = await this.stockRepository.findOrCreate({
        where,
        defaults: {
          schet,
          date,
          firstSubcontoId,
          secondSubcontoId: this.schetsWithOneSubconto.includes(schet) ? null : secondSubcontoId,
          count: debetKredit === DEBETKREDIT.DEBET ? count : -count,
          total: debetKredit === DEBETKREDIT.DEBET ? total : -total,
          remainCount: 0,
          remainTotal: 0,
          comment,
        },
        transaction,
      });

      if (!stock) {
        throw new Error(
          `Failed to find or create stock for schet=${schet}, date=${date}, firstSubcontoId=${firstSubcontoId}, secondSubcontoId=${secondSubcontoId}`
        );
      }

      if (!created) {
        stock.count += debetKredit === DEBETKREDIT.DEBET ? count : -count;
        stock.total += debetKredit === DEBETKREDIT.DEBET ? total : -total;
        stock.comment = stock.comment ? `${stock.comment.trim()}, ${comment}` : comment;
        const updatedStock = await stock.save({ transaction });
        if (!updatedStock) {
          throw new Error(
            `Failed to update stock for schet=${schet}, date=${date}, firstSubcontoId=${firstSubcontoId}, secondSubcontoId=${secondSubcontoId}`
          );
        }
      }

      await this.recalculateRemains(schet, firstSubcontoId, secondSubcontoId, date, transaction);

      return stock;
    } catch (error) {
      console.error('Error in addEntry:', error.message);
      throw new Error(
        `Failed to add entry for schet=${schet}, date=${date}, firstSubcontoId=${firstSubcontoId}, secondSubcontoId=${secondSubcontoId}: ${error.message}`
      );
    }
  }

  async addTwoEntries(entry: EntryCreationAttrs, transaction?: Transaction): Promise<Stock[]> {
    if (this.checkEntryForDublicate(entry)) {
      return []; // Возвращаем пустой массив, если запись является дубликатом
    }

    const debetStock = await this.addEntry(
      entry.debet,
      entry.date,
      entry.debetFirstSubcontoId,
      entry.debetSecondSubcontoId,
      entry.count,
      entry.total,
      DEBETKREDIT.DEBET,
      String(entry.docId),
      transaction,
    );

    const kreditStock = await this.addEntry(
      entry.kredit,
      entry.date,
      entry.kreditFirstSubcontoId,
      entry.kreditSecondSubcontoId,
      entry.count,
      entry.total,
      DEBETKREDIT.KREDIT,
      String(entry.docId),
      transaction,
    );

    return [debetStock, kreditStock];
  }

  async addEntrieToTMZ(entry: EntryCreationAttrs, transaction?: Transaction): Promise<Stock | null> {
    if (this.checkEntryForDublicate(entry)) {
      return null; // Возвращаем null, чтобы указать, что объект не создавался из-за дубликата
    }
  
    const tmzSchets = [Schet.S10, Schet.S21];
    const tmzInDebet = tmzSchets.includes(entry.debet) && !tmzSchets.includes(entry.kredit);
    const tmzInKredit = !tmzSchets.includes(entry.debet) && tmzSchets.includes(entry.kredit);
  
    if (tmzInDebet) {
      return await this.addEntry(
        entry.debet,
        entry.date,
        entry.debetSecondSubcontoId,
        null,
        entry.count,
        entry.total,
        DEBETKREDIT.DEBET,
        String(entry.docId),
        transaction,
      );
    }
  
    if (tmzInKredit) {
      return await this.addEntry(
        entry.kredit,
        entry.date,
        entry.kreditSecondSubcontoId,
        null,
        entry.count,
        entry.total,
        DEBETKREDIT.KREDIT,
        String(entry.docId),
        transaction,
      );
    }
  
    return null; // Возвращаем null, если не было условий для создания записи
  }

  async deleteEntry(
    schet: Schet,
    date: bigint,
    firstSubcontoId: number | null,
    secondSubcontoId: number | null,
    count: number,
    total: number,
    debetKredit: DEBETKREDIT,
    transaction?: Transaction
  ) {
    const where = this.getWhereClause(schet, date, firstSubcontoId, secondSubcontoId);
    const stock = await this.stockRepository.findOne({ where, transaction });
    // console.log('deleting - where -- ', where, 'count - ', count, 'total - ', total)

    if (!stock) {
      throw new Error(`Stock not found for( schet = ${schet}, date = ${date} , firstSubcontoId = ${firstSubcontoId}, secondSubcontoId = ${secondSubcontoId}, debetKredit = ${debetKredit})`)
    }

    stock.count -= debetKredit === DEBETKREDIT.DEBET ? count : -count;
    stock.total -= debetKredit === DEBETKREDIT.DEBET ? total : -total;

    // await stock.save({ transaction });

    try {
      await stock.save({ transaction });
    } catch (error) {
      console.error('Ошибка при сохранении stock:', error);
      throw error;
    }

    await this.recalculateRemains(schet, firstSubcontoId, secondSubcontoId, date, transaction);
  }

  async deleteTwoEntries(entry: EntryCreationAttrs, transaction?: Transaction) {
    if (this.checkEntryForDublicate(entry)) return;

      await this.deleteEntry(
        entry.debet,
        entry.date,
        entry.debetFirstSubcontoId,
        entry.debetSecondSubcontoId,
        entry.count,
        entry.total,
        DEBETKREDIT.DEBET,
        transaction
      )
      await this.deleteEntry(
        entry.kredit,
        entry.date,
        entry.kreditFirstSubcontoId,
        entry.kreditSecondSubcontoId,
        entry.count,
        entry.total,
        DEBETKREDIT.KREDIT,
        transaction
      )
  }

  async deleteEntrieToTMZ(entry: EntryCreationAttrs, transaction?: Transaction) {
    if (this.checkEntryForDublicate(entry)) return;

    const tmzSchets = [Schet.S10, Schet.S21];
    const tmzInDebet = tmzSchets.includes(entry.debet) && !tmzSchets.includes(entry.kredit);
    const tmzInKredit = !tmzSchets.includes(entry.debet) && tmzSchets.includes(entry.kredit);

    if (tmzInDebet) {
      await this.deleteEntry(
        entry.debet,
        entry.date,
        entry.debetSecondSubcontoId,
        null,
        entry.count,
        entry.total,
        DEBETKREDIT.DEBET,
        transaction
      );
    }

    if (tmzInKredit) {
      await this.deleteEntry(
        entry.kredit,
        entry.date,
        entry.kreditSecondSubcontoId,
        null,
        entry.count,
        entry.total,
        DEBETKREDIT.KREDIT,
        transaction
      );
    }
  }

  async recalculateRemains(
    schet: string,
    firstSubcontoId: number | null,
    secondSubcontoId: number | null,
    fromDate: bigint,
    transaction?: Transaction
  ) {
    const where = {
      schet,
      firstSubcontoId,
      secondSubcontoId: this.schetsWithOneSubconto.includes(schet as Schet) ? null : secondSubcontoId,
      date: { [Op.gte]: fromDate },
    };
    const stocks = await this.stockRepository.findAll({
      where,
      order: [['date', 'ASC']],
      transaction,
    });

    let runningCount = 0;
    let runningTotal = 0;

    const previous = await this.stockRepository.findOne({
      where: {
        schet,
        firstSubcontoId,
        secondSubcontoId: this.schetsWithOneSubconto.includes(schet as Schet) ? null : secondSubcontoId,
        date: { [Op.lt]: fromDate },
      },
      order: [
        ['date', 'DESC'],
        ['id', 'DESC']
      ],
      transaction,
    });

    if (firstSubcontoId == 19606) {
      console.log('Length ---- ')
      console.log(stocks.length)
      for (const stock of stocks) {
        console.log(stock.dataValues)
      }
    }
    // ----

    if (previous) {
      runningCount = previous.remainCount;
      runningTotal = previous.remainTotal;
    }

    for (const stock of stocks) {
      runningCount += stock.count;
      runningTotal += stock.total;
      stock.remainCount = runningCount;
      stock.remainTotal = runningTotal;
      if (stock.firstSubcontoId == 19606) {
        console.log('-------------------')
        console.log(stock.remainTotal)
      }
      await stock.save({ transaction });
    }
  }

  async getStockByDate(
    schet: Schet,
    firstSubcontoId: number | null,
    secondSubcontoId: number | null,
    targetDate: number,
    transaction?: Transaction
  ) {
    let where: any = {
      schet,
      secondSubcontoId: this.schetsWithOneSubconto.includes(schet) ? null : secondSubcontoId,
      date: { [Op.lt]: targetDate },
    };

    if (firstSubcontoId !== null) {
      where = { ...where, firstSubcontoId };
    }

    const stock = await this.stockRepository.findOne({
      where,
      order: [
        ['date', 'DESC'],
        ['id', 'DESC']
      ],
      transaction,
    });

    return stock
      ? {
          date: stock.date,
          count: stock.count,
          total: stock.total,
          remainCount: stock.remainCount,
          remainTotal: stock.remainTotal,
        }
      : { date: null, count: 0, total: 0, remainCount: 0, remainTotal: 0 };
  }
}