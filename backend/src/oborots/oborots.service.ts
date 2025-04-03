import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Schet } from 'src/interfaces/report.interface';
import { Oborot } from './oborot.model';
import { EntryCreationAttrs } from 'src/entries/entry.model';
import { Sequelize } from 'sequelize-typescript';
const { Op } = require('sequelize');

@Injectable()
export class OborotsService {
    private schetsWithOneSubconto = [Schet.S40, Schet.S50, Schet.S60, Schet.S66, Schet.S67, Schet.S68]

    constructor( @InjectModel(Oborot) private oborotRepository: typeof Oborot ) {}
    
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
            kreditThirdSubcontoId
        } = entry
        

        const where: any = {date};
        if (debet) where.debet = debet
        if (debetFirstSubcontoId) where.debetFirstSubcontoId = debetFirstSubcontoId
        if (debetSecondSubcontoId) where.debetSecondSubcontoId = debetSecondSubcontoId
        if (debetThirdSubcontoId) where.debetThirdSubcontoId = debetThirdSubcontoId
        if (kredit) where.kredit = kredit
        if (kreditFirstSubcontoId) where.kreditFirstSubcontoId = kreditFirstSubcontoId
        if (kreditSecondSubcontoId) where.kreditSecondSubcontoId = kreditSecondSubcontoId
        if (kreditThirdSubcontoId) where.kreditThirdSubcontoId = kreditThirdSubcontoId

        return where;
    }

    async addEntry(entry: EntryCreationAttrs ) {
        const where = this.getWhereClause(entry);
        const {
            date, debet, 
            debetFirstSubcontoId,
            debetSecondSubcontoId,
            debetThirdSubcontoId,
            kredit,
            kreditFirstSubcontoId,
            kreditSecondSubcontoId,
            kreditThirdSubcontoId,
            count,total
        } = entry

        const [oborot, created] = await Oborot.findOrCreate({
            where,
            defaults: {
                date, debet, 
                debetFirstSubcontoId,
                debetSecondSubcontoId,
                debetThirdSubcontoId,
                kredit,
                kreditFirstSubcontoId,
                kreditSecondSubcontoId,
                kreditThirdSubcontoId,
                count, total
            },
        });
    
        if (!created) {
            oborot.count += count;
            oborot.total += total;
            await oborot.save();
        }
    }
    
    async deleteEntry(entry: EntryCreationAttrs) {

        const where = this.getWhereClause(entry);
        const oborot = await Oborot.findOne({ where });
        const {count, total} = entry
        if (!oborot) {
            return;
        }

        oborot.count = oborot.count - count;
        oborot.total = oborot.total - total;

        if (oborot.count === 0 && oborot.total === 0) {
            await oborot.destroy();
        } else {
            await oborot.save();
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
        kreditThirdSubcontoId: number | null ) {
        
        
        let where: any = {}
        if (debet) where.debet = debet
        if (debetFirstSubcontoId) where.debetFirstSubcontoId = debetFirstSubcontoId
        if (debetSecondSubcontoId) where.debetSecondSubcontoId = debetSecondSubcontoId
        if (debetThirdSubcontoId) where.debetThirdSubcontoId = debetThirdSubcontoId
        if (kredit) where.kredit = kredit
        if (kreditFirstSubcontoId) where.kreditFirstSubcontoId = kreditFirstSubcontoId
        if (kreditSecondSubcontoId) where.kreditSecondSubcontoId = kreditSecondSubcontoId
        if (kreditThirdSubcontoId) where.kreditThirdSubcontoId = kreditThirdSubcontoId

        const columnToSum = typeResult === 'COUNT' ? 'count' : 'total';

        const sumResult = await Oborot.aggregate(
            columnToSum, // Колонка для суммирования
            'SUM',       // Функция агрегации
            {
                where: {
                    date: {
                        [Op.gte]: startDate,  
                        [Op.lte]: endDate
                    },
                    ...where
                },
                dataType: 'integer' // Указываем тип результата
            }
        );
    
        return {
            date: null,
            result: sumResult ? Number(sumResult) : 0
        };
    }
    
}
