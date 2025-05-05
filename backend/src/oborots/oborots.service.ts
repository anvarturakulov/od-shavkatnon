import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize, Transaction, Op } from 'sequelize'; // Импорт из sequelize
import { Schet } from 'src/interfaces/report.interface';
import { Oborot } from './oborot.model';
import { EntryCreationAttrs } from 'src/entries/entry.model';

@Injectable()
export class OborotsService {
  private schetsWithOneSubconto = [Schet.S40, Schet.S50, Schet.S60, Schet.S66, Schet.S67, Schet.S68];

  constructor(
    @InjectModel(Oborot) private oborotRepository: typeof Oborot,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  private getWhereClause(entry: EntryCreationAttrs) {
    const {
      date,
      debet,
      debetFirstSubcontoId,
      debetSecondSubcontoId,
      debetThirdSubcontoId,
      kredit,
      kreditFirstSubcontoId,
      kreditSecondSubcontoId,
      kreditThirdSubcontoId,
    } = entry;

    const where: any = { date };
    if (debet) where.debet = debet;
    if (debetFirstSubcontoId) where.debetFirstSubcontoId = debetFirstSubcontoId;
    if (debetSecondSubcontoId) where.debetSecondSubcontoId = debetSecondSubcontoId;
    if (debetThirdSubcontoId) where.debetThirdSubcontoId = debetThirdSubcontoId;
    if (kredit) where.kredit = kredit;
    if (kreditFirstSubcontoId) where.kreditFirstSubcontoId = kreditFirstSubcontoId;
    if (kreditSecondSubcontoId) where.kreditSecondSubcontoId = kreditSecondSubcontoId;
    if (kreditThirdSubcontoId) where.kreditThirdSubcontoId = kreditThirdSubcontoId;

    return where;
  }

  async addEntry(entry: EntryCreationAttrs, transaction?: Transaction) {
    const where = this.getWhereClause(entry);
    const {
      date,
      debet,
      debetFirstSubcontoId,
      debetSecondSubcontoId,
      debetThirdSubcontoId,
      kredit,
      kreditFirstSubcontoId,
      kreditSecondSubcontoId,
      kreditThirdSubcontoId,
      count,
      total,
    } = entry;

    const [oborot, created] = await this.oborotRepository.findOrCreate({
      where,
      defaults: {
        date,
        debet,
        debetFirstSubcontoId,
        debetSecondSubcontoId,
        debetThirdSubcontoId,
        kredit,
        kreditFirstSubcontoId,
        kreditSecondSubcontoId,
        kreditThirdSubcontoId,
        count,
        total,
      },
      transaction,
    });

    if (!created) {
      oborot.count += count;
      oborot.total += total;
      await oborot.save({ transaction });
    }
  }

  async deleteEntry(entry: EntryCreationAttrs, transaction?: Transaction) {
    const where = this.getWhereClause(entry);
    const oborot = await this.oborotRepository.findOne({ where, transaction });
    const { count, total } = entry;

    if (!oborot) {
      throw new Error(`Oborot not found for entry (docId) ${entry.docId}`)
    }

    oborot.count -= count;
    oborot.total -= total;

    if (oborot.count === 0 && oborot.total === 0) {
      await oborot.destroy({ transaction });
    } else {
      await oborot.save({ transaction });
    }
  }

  async getOborotByDate(
    typeResult: 'COUNT' | 'TOTAL',
    startDate: number | null,
    endDate: number | null,
    debet: Schet | null,
    debetFirstSubcontoId: number | null,
    debetSecondSubcontoId: number | null,
    debetThirdSubcontoId: number | null,
    kredit: Schet | null,
    kreditFirstSubcontoId: number | null,
    kreditSecondSubcontoId: number | null,
    kreditThirdSubcontoId: number | null,
    transaction?: Transaction
  ) {
    let where: any = {};
    if (debet) where.debet = debet;
    if (debetFirstSubcontoId) where.debetFirstSubcontoId = debetFirstSubcontoId;
    if (debetSecondSubcontoId) where.debetSecondSubcontoId = debetSecondSubcontoId;
    if (debetThirdSubcontoId) where.debetThirdSubcontoId = debetThirdSubcontoId;
    if (kredit) where.kredit = kredit;
    if (kreditFirstSubcontoId) where.kreditFirstSubcontoId = kreditFirstSubcontoId;
    if (kreditSecondSubcontoId) where.kreditSecondSubcontoId = kreditSecondSubcontoId;
    if (kreditThirdSubcontoId) where.kreditThirdSubcontoId = kreditThirdSubcontoId;

    const columnToSum = typeResult === 'COUNT' ? 'count' : 'total';

    const sumResult = await this.oborotRepository.aggregate(
      columnToSum,
      'SUM',
      {
        where: {
          date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
          ...where,
        },
        dataType: 'integer',
        transaction,
      }
    );

    return {
      date: null,
      result: sumResult ? Number(sumResult) : 0,
    };
  }
}