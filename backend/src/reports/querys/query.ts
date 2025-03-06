import { Sequelize } from 'sequelize-typescript';
import { QuerySimple, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { PDKOL } from './typeQuery/PDKOL';
import { PDSUM } from './typeQuery/PDSUM';

export const query = async (req: QuerySimple, sequelize: Sequelize): Promise<number> => {
    
    const { reportType, typeQuery, sectionId, schet, dk, workerId, name,
        startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, firstPrice, secondPrice} = req;

    try {
        let replacements: { [key: string]: any } = {};
        let query: string = ''
        let middle: {[key: string]: any} = {query, replacements}
        
        middle = (() => {
            switch (typeQuery) {
                case TypeQuery.PDKOL: return {...PDKOL(req)}
                case TypeQuery.PDSUM: return {...PDSUM(req)}
            }
        })

        query = middle.query
        replacements = {...middle.replacements}
        
        const [results] = await sequelize.query(query, {
            replacements,
            type: 'SELECT',
        });

        const result = results[0] as { total: string | null };
        return result.total ? parseFloat(result.total) : 0;

    } catch (error) {
        throw new BadRequestException('Database error: ' + error.message);
    }
}