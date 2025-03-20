import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Stock } from './stock.model';
import { EntryCreationAttrs } from 'src/entries/entry.model';
import { Schet } from 'src/interfaces/report.interface';
import Redis from 'ioredis';

@Injectable()
export class StocksService {
    private readonly redis: Redis;
    private schetsWithOneSubconto = [Schet.S40, Schet.S50, Schet.S60, Schet.S66, Schet.S67, Schet.S68]

    constructor( @InjectModel(Stock) private stockRepository: typeof Stock ) {
            this.redis = new Redis({ host: 'localhost', port: 6379 }) 
        }
    

    async addStockByEntry(entry: EntryCreationAttrs) {
        // first 
        let stockDebet = await this.stockRepository.findOne({
            where: { 
                schet: entry.debet,
                date: entry.date,
                firstSubcontoId: entry.debetFirstSubcontoId,
                ... ( !this.schetsWithOneSubconto.includes(entry.debet) 
                    ? {secondSubcontoId: entry.debetSecondSubcontoId}
                    : {}
                ), 
                }
            });
    
            if (!stockDebet) {
            stockDebet = await this.stockRepository.create(
                {
                schet: entry.debet,
                date: entry.date,
                firstSubcontoId: entry.debetFirstSubcontoId,
                ... ( !this.schetsWithOneSubconto.includes(entry.debet) 
                  ? { secondSubcontoId: entry.debetSecondSubcontoId } 
                  : {} 
                ),
                count: 0,
                total: 0
                },
            );
            }
    
            stockDebet.count += entry.count;
            stockDebet.total += entry.total
            await stockDebet.save();

            const redisKeyDebet = `stock:${entry.debet}
                                   :${entry.date}
                                   :${entry.debetFirstSubcontoId}
                                   ${!this.schetsWithOneSubconto.includes(entry.debet) ? ':'+entry.debetSecondSubcontoId : ''}`;
            
            await this.redis.hset(redisKeyDebet, 'count', stockDebet.count.toString());
            await this.redis.hset(redisKeyDebet, 'total', stockDebet.total.toString());
        
        // second
        let stockKredit = await this.stockRepository.findOne({
            where: { 
                schet: entry.kredit,
                date: entry.date,
                firstSubcontoId: entry.kreditFirstSubcontoId,
                ... ( !this.schetsWithOneSubconto.includes(entry.kredit) 
                    ? { secondSubcontoId: entry.kreditSecondSubcontoId } 
                    : {}
                ),
            }
            });
    
            if (!stockKredit) {
            stockKredit = await this.stockRepository.create(
                {
                schet: entry.kredit,
                date: entry.date,
                firstSubcontoId: entry.kreditFirstSubcontoId,
                ... ( !this.schetsWithOneSubconto.includes(entry.kredit) 
                    ? { secondSubcontoId: entry.kreditSecondSubcontoId } 
                    : {}
                ),
                count: 0,
                total: 0
                },
            );
            }
    
            stockKredit.count -= entry.count;
            stockKredit.total -= entry.total
            await stockKredit.save();

            const redisKeyKredit = `stock:${entry.kredit}
                                   :${entry.date}
                                   :${entry.debetFirstSubcontoId}
                                   ${!this.schetsWithOneSubconto.includes(entry.kredit) ? ':'+entry.kreditSecondSubcontoId : ''}`;
            
            await this.redis.hset(redisKeyKredit, 'count', stockKredit.count.toString());
            await this.redis.hset(redisKeyKredit, 'total', stockKredit.total.toString());
    }

    async removeStockByEntry(entry: EntryCreationAttrs) {
        // first 
        let stockDebet = await this.stockRepository.findOne({
            where: { 
                schet: entry.debet,
                date: entry.date,
                firstSubcontoId: entry.debetFirstSubcontoId,
                ... ( !this.schetsWithOneSubconto.includes(entry.debet) 
                  ? { secondSubcontoId: entry.debetSecondSubcontoId } 
                  : {}
                )}
            });
    
            if (stockDebet) {
                stockDebet.count -= entry.count;
                stockDebet.total -= entry.total
                await stockDebet.save();
            }

            const redisKeyDebet = `stock:${entry.debet}
                                   :${entry.date}
                                   :${entry.debetFirstSubcontoId}
                                   ${!this.schetsWithOneSubconto.includes(entry.debet) ? ':'+entry.debetSecondSubcontoId : ''}`;
           
            const cachedCountDebet = await this.redis.hget(redisKeyDebet, 'count');
            if (cachedCountDebet !== null) {
                const newCountDebetToCach = parseInt(cachedCountDebet, 10) - entry.count
                await this.redis.hset(redisKeyDebet, 'count', newCountDebetToCach.toString());
            }
            
            const cachedTotalDebet = await this.redis.hget(redisKeyDebet, 'total');
            if (cachedTotalDebet !== null) {
                const newTotalDebetToCach = parseInt(cachedTotalDebet, 10) - entry.total
                await this.redis.hset(redisKeyDebet, 'total', newTotalDebetToCach.toString());
            }
            
        // second
        let stockKredit = await this.stockRepository.findOne({
            where: { 
                schet: entry.kredit,
                date: entry.date,
                firstSubcontoId: entry.kreditFirstSubcontoId,
                ... ( !this.schetsWithOneSubconto.includes(entry.kredit) 
                    ? { secondSubcontoId: entry.kreditSecondSubcontoId } 
                    : {}
                )}
            });
    
            if (stockKredit) {
                stockKredit.count += entry.count;
                stockKredit.total += entry.total
                await stockKredit.save();
            }
    
            const redisKeyKredit = `stock:${entry.kredit}
                                   :${entry.date}
                                   :${entry.debetFirstSubcontoId}
                                   ${!this.schetsWithOneSubconto.includes(entry.kredit) ? ':'+entry.kreditSecondSubcontoId : ''}`;
            
            const cachedCountKredit = await this.redis.hget(redisKeyKredit, 'count');
            if (cachedCountKredit !== null) {
                const newCountKreditToCach = parseInt(cachedCountKredit, 10) + entry.count
                await this.redis.hset(redisKeyDebet, 'count', newCountKreditToCach.toString());
            }
            
            const cachedTotalKredit = await this.redis.hget(redisKeyDebet, 'total');
            if (cachedTotalKredit !== null) {
                const newTotalKreditToCach = parseInt(cachedTotalKredit, 10) + entry.total
                await this.redis.hset(redisKeyDebet, 'total', newTotalKreditToCach.toString());
            }
            
    }
}
