import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stock } from './stock.model';
import { EntryCreationAttrs } from 'src/entries/entry.model';
import { DEBETKREDIT, Schet } from 'src/interfaces/report.interface';
import Redis from 'ioredis';
import { Sequelize, Op } from 'sequelize';

@Injectable()
export class StocksService {
    // private readonly redis: Redis;
    private schetsWithOneSubconto = [Schet.S40, Schet.S50, Schet.S60, Schet.S66, Schet.S67, Schet.S68]

    constructor( @InjectModel(Stock) private stockRepository: typeof Stock ) {
        // this.redis = new Redis({ host: 'localhost', port: 6379 }) 
    }
    
    private getWhereClause(
        schet: Schet,
        date: bigint,
        firstSubcontoId: number | null,
        secondSubcontoId: number | null ) {

        const where: any = { schet, date, firstSubcontoId };
        
        if (!this.schetsWithOneSubconto.includes(schet as Schet)) {
          where.secondSubcontoId = secondSubcontoId;
        } else {
          where.secondSubcontoId = null; // Принудительно null для счетов с одним субконто
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
        debetKredit: DEBETKREDIT
    ) {

        const where = this.getWhereClause(schet, date, firstSubcontoId, secondSubcontoId);
        const [stock, created] = await Stock.findOrCreate({
          where,
          defaults: {
            schet,
            date,
            firstSubcontoId,
            secondSubcontoId: this.schetsWithOneSubconto.includes(schet) ? null : secondSubcontoId,
            count: debetKredit == DEBETKREDIT.DEBET ? count : (-1) * count,
            total: debetKredit == DEBETKREDIT.DEBET ? total : (-1) * total,
            remainCount: 0,
            remainTotal: 0,
          },
        });
    
        if (!created) {
          if (debetKredit == DEBETKREDIT.DEBET) {
            stock.count += count;
            stock.total += total;
          } else {
            stock.count -= count;
            stock.total -= total;
          }
          await stock.save();
        }
    
        await this.recalculateRemains(schet, firstSubcontoId, secondSubcontoId, date);
        // await this.updateRedis(stock);
    }
    
    async addTwoEntries(entry: EntryCreationAttrs) {
        await Promise.all([
            this.addEntry(
                entry.debet,
                entry.date,
                entry.debetFirstSubcontoId,
                entry.debetSecondSubcontoId,
                entry.count,
                entry.total,
                DEBETKREDIT.DEBET
            ),
            this.addEntry(
                entry.kredit,
                entry.date,
                entry.kreditFirstSubcontoId,
                entry.kreditSecondSubcontoId,
                entry.count,
                entry.total,
                DEBETKREDIT.KREDIT
            ),
        ]);
    }

    async addEntrieToTMZ(entry: EntryCreationAttrs) {
        const tmzSchets = [Schet.S10, Schet.S21]
        const tmzInDebet = (
            tmzSchets.includes(entry.debet) && !tmzSchets.includes(entry.kredit)
        ) ? true : false

        const tmzInKredit = (
            !tmzSchets.includes(entry.debet) && tmzSchets.includes(entry.kredit)
        ) ? true : false
        
        if ( tmzInDebet ) {
            this.addEntry(
                entry.debet,
                entry.date,
                entry.debetSecondSubcontoId,
                null,
                entry.count,
                entry.total,
                DEBETKREDIT.DEBET
            )
        }

        if ( tmzInKredit ) {
            this.addEntry(
                entry.kredit,
                entry.date,
                entry.kreditSecondSubcontoId,
                null,
                entry.count,
                entry.total,
                DEBETKREDIT.KREDIT
            )
        }
    }

    // async updateEntry(
    //     schet: Schet,
    //     date: bigint,
    //     firstSubcontoId: number | null,
    //     secondSubcontoId: number | null,
    //     oldCount: number,
    //     oldTotal: number,
    //     newCount: number,
    //     newTotal: number ) {

    //     const where = this.getWhereClause(schet, date, firstSubcontoId, secondSubcontoId);
    //     const stock = await Stock.findOne({ where });

    //     if (!stock) {
    //         throw new Error('Stock not found for this date and combination');
    //     }

    //     const deltaCount = newCount - oldCount;
    //     const deltaTotal = newTotal - oldTotal;

    //     stock.count += deltaCount;
    //     stock.total += deltaTotal;
    //     await stock.save();

    //     await this.recalculateRemains(schet, firstSubcontoId, secondSubcontoId, date);
    //     await this.updateRedis(stock);
    // }
    
    async deleteEntry(
        schet: Schet,
        date: bigint,
        firstSubcontoId: number | null,
        secondSubcontoId: number | null,
        count: number,
        total: number,
        debetKredit: DEBETKREDIT) {

        const where = this.getWhereClause(schet, date, firstSubcontoId, secondSubcontoId);
        const stock = await Stock.findOne({ where });

        if (!stock) {
            return;
        }

        if (debetKredit == DEBETKREDIT.DEBET) {
            stock.count = stock.count - count;
            stock.total = stock.total - total;
        } else {
            stock.count = stock.count + count;
            stock.total = stock.total + total;
        }

        if (stock.count === 0 && stock.total === 0) {
            await stock.destroy();
        } else {
            await stock.save();
        }

        await this.recalculateRemains(schet, firstSubcontoId, secondSubcontoId, date);
        
        // if (stock.count === 0 && stock.total === 0) {
        //     await this.deleteFromRedis(schet, firstSubcontoId, secondSubcontoId, date);
        // } else {
        //     await this.updateRedis(stock);
        // }
    }

    async deleteTwoEntries(entry: EntryCreationAttrs) {
        await Promise.all([
            this.deleteEntry(
                entry.debet,
                entry.date,
                entry.debetFirstSubcontoId,
                entry.debetSecondSubcontoId,
                entry.count,
                entry.total,
                DEBETKREDIT.DEBET
            ),
            this.deleteEntry(
                entry.kredit,
                entry.date,
                entry.kreditFirstSubcontoId,
                entry.kreditSecondSubcontoId,
                entry.count,
                entry.total,
                DEBETKREDIT.KREDIT
            ),
        ]);
    }

    async deleteEntrieToTMZ(entry: EntryCreationAttrs) {

        const tmzSchets = [Schet.S10, Schet.S21]
        const tmzInDebet = (
            tmzSchets.includes(entry.debet) && !tmzSchets.includes(entry.kredit)
        ) ? true : false

        const tmzInKredit = (
            !tmzSchets.includes(entry.debet) && tmzSchets.includes(entry.kredit)
        ) ? true : false

        if (tmzInDebet) {
            this.deleteEntry(
                entry.debet,
                entry.date,
                entry.debetSecondSubcontoId,
                null,
                entry.count,
                entry.total,
                DEBETKREDIT.DEBET
            )
        }

        if (tmzInKredit) {
            this.deleteEntry(
                entry.kredit,
                entry.date,
                entry.kreditSecondSubcontoId,
                null,
                entry.count,
                entry.total,
                DEBETKREDIT.KREDIT
            )
        }

        
    }
    
    async recalculateRemains(
        schet: string,
        firstSubcontoId: number | null,
        secondSubcontoId: number | null,
        fromDate: bigint ) {
        const where = {
            schet,
            firstSubcontoId,
            secondSubcontoId: this.schetsWithOneSubconto.includes(schet as Schet) ? null : secondSubcontoId,
            date: { [Op.gte]: fromDate },
        };
        const stocks = await Stock.findAll({
            where,
            order: [['date', 'ASC']],
        });

        let runningCount = 0;
        let runningTotal = 0;

        const previous = await Stock.findOne({
            where: {
            schet,
            firstSubcontoId,
            secondSubcontoId: this.schetsWithOneSubconto.includes(schet as Schet) ? null : secondSubcontoId,
            date: { [Op.lt]: fromDate },
            },
            order: [['date', 'DESC']],
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
            await stock.save();
            // await this.updateRedis(stock);
        }
    }
    
    async getStockByDate(
        schet: Schet,
        firstSubcontoId: number | null,
        secondSubcontoId: number | null,
        targetDate: number ) {
        
        // const setKey = `sorted_stock:${schet}:${firstSubcontoId}:${secondSubcontoId}`;
        // const keys = await this.redis.zrangebyscore(setKey, '-inf', targetDate);

        // if (keys.length > 0) {
        //     const latestKey = keys[keys.length - 1];
        //     const values = await this.redis.hgetall(latestKey);
        //     return {
        //         date: BigInt(latestKey.split(':')[4]),
        //         count: parseFloat(values.count),
        //         total: parseFloat(values.total),
        //         remainCount: parseFloat(values.remainCount),
        //         remainTotal: parseFloat(values.remainTotal),
        //     };
        // }

        let where:any = {
            schet,
            secondSubcontoId: this.schetsWithOneSubconto.includes(schet) ? null : secondSubcontoId,
            date: { [Op.lt]: targetDate },
        };

        if (firstSubcontoId != null) where = {
            ...where,
            firstSubcontoId: firstSubcontoId
        }

        const stock = await Stock.findOne({
            where,
            order: [['date', 'DESC']],
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
    
    // private async updateRedis(stock: Stock) {
    //     const hashKey = `stock:${stock.schet}:${stock.firstSubcontoId}:${stock.secondSubcontoId}:${stock.date}`;
    //     const setKey = `sorted_stock:${stock.schet}:${stock.firstSubcontoId}:${stock.secondSubcontoId}`;
    //     await this.redis.hset(hashKey, {
    //         count: stock.count.toString(),
    //         total: stock.total.toString(),
    //         remainCount: stock.remainCount.toString(),
    //         remainTotal: stock.remainTotal.toString(),
    //     });
    //     await this.redis.zadd(setKey, Number(stock.date), hashKey);
    // }
    
    // private async deleteFromRedis(
    //     schet: Schet,
    //     firstSubcontoId: number | null,
    //     secondSubcontoId: number | null,
    //     date: bigint) {

    //     const hashKey = `stock:${schet}:${firstSubcontoId}:${secondSubcontoId}:${date}`;
    //     const setKey = `sorted_stock:${schet}:${firstSubcontoId}:${secondSubcontoId}`;
    //     await this.redis.del(hashKey);
    //     await this.redis.zrem(setKey, hashKey);
    // }
    
}
