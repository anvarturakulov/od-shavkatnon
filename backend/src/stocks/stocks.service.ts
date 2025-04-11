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
    transaction?: Transaction
  ) {
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
      },
      transaction,
    });

    if (!created) {
      stock.count += debetKredit === DEBETKREDIT.DEBET ? count : -count;
      stock.total += debetKredit === DEBETKREDIT.DEBET ? total : -total;
      await stock.save({ transaction });
    }

    await this.recalculateRemains(schet, firstSubcontoId, secondSubcontoId, date, transaction);
  }

  async addTwoEntries(entry: EntryCreationAttrs, transaction?: Transaction) {
    if (this.checkEntryForDublicate(entry)) return;

    await Promise.all([
      this.addEntry(
        entry.debet,
        entry.date,
        entry.debetFirstSubcontoId,
        entry.debetSecondSubcontoId,
        entry.count,
        entry.total,
        DEBETKREDIT.DEBET,
        transaction
      ),
      this.addEntry(
        entry.kredit,
        entry.date,
        entry.kreditFirstSubcontoId,
        entry.kreditSecondSubcontoId,
        entry.count,
        entry.total,
        DEBETKREDIT.KREDIT,
        transaction
      ),
    ]);
  }

  async addEntrieToTMZ(entry: EntryCreationAttrs, transaction?: Transaction) {
    if (this.checkEntryForDublicate(entry)) return;

    const tmzSchets = [Schet.S10, Schet.S21];
    const tmzInDebet = tmzSchets.includes(entry.debet) && !tmzSchets.includes(entry.kredit);
    const tmzInKredit = !tmzSchets.includes(entry.debet) && tmzSchets.includes(entry.kredit);

    if (tmzInDebet) {
      await this.addEntry(
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
      await this.addEntry(
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

    if (!stock) {
      return;
    }

    stock.count -= debetKredit === DEBETKREDIT.DEBET ? count : -count;
    stock.total -= debetKredit === DEBETKREDIT.DEBET ? total : -total;

    if (stock.count === 0 && stock.total === 0) {
      await stock.destroy({ transaction });
    } else {
      await stock.save({ transaction });
    }

    await this.recalculateRemains(schet, firstSubcontoId, secondSubcontoId, date, transaction);
  }

  async deleteTwoEntries(entry: EntryCreationAttrs, transaction?: Transaction) {
    if (this.checkEntryForDublicate(entry)) return;

    await Promise.all([
      this.deleteEntry(
        entry.debet,
        entry.date,
        entry.debetFirstSubcontoId,
        entry.debetSecondSubcontoId,
        entry.count,
        entry.total,
        DEBETKREDIT.DEBET,
        transaction
      ),
      this.deleteEntry(
        entry.kredit,
        entry.date,
        entry.kreditFirstSubcontoId,
        entry.kreditSecondSubcontoId,
        entry.count,
        entry.total,
        DEBETKREDIT.KREDIT,
        transaction
      ),
    ]);
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
      order: [['date', 'DESC']],
      transaction,
    });

    if (previous) {
      runningCount = previous.remainCount;
      runningTotal = previous.remainTotal;
    }

    for (const stock of stocks) {
      runningCount += stock.count;
      runningTotal += stock.total;
      stock.remainCount = runningCount;
      stock.remainTotal = runningTotal;
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
      order: [['date', 'DESC']],
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