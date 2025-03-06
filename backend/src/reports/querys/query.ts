import { Sequelize } from 'sequelize-typescript';
import { QuerySimple, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { PDKOL } from './typeQuery/PDKOL';
import { PDSUM } from './typeQuery/PDSUM';
import { PKKOL } from './typeQuery/PKKOL';
import { PKSUM } from './typeQuery/PKSUM';
import { TDKOL } from './typeQuery/TDKOL';
import { TDSUM } from './typeQuery/TDSUM';
import { TKKOL } from './typeQuery/TKKOL';
import { TKSUM } from './typeQuery/TKSUM';

export const query = async (req: QuerySimple, sequelize: Sequelize): Promise<number> => {
    
    const { reportType, typeQuery, sectionId, schet, dk, workerId, name,
        startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, firstPrice, secondPrice} = req;

    try {
        let replacements: { [key: string]: any } = {};
        let query: string = ''
        let stopQuery: boolean = false
        let middle: {[key: string]: any} = {query, replacements}
        
        middle = (() => {
            switch (typeQuery) {
                case TypeQuery.PDKOL: return {...PDKOL(req)}
                case TypeQuery.PDSUM: return {...PDSUM(req)}
                case TypeQuery.PKKOL: return {...PKKOL(req)}
                case TypeQuery.PKSUM: return {...PKSUM(req)}
                
                case TypeQuery.TDKOL: return {...TDKOL(req)}
                case TypeQuery.TDSUM: return {...TDSUM(req)}
                case TypeQuery.TKKOL: return {...TKKOL(req)}
                case TypeQuery.TKSUM: return {...TKSUM(req)}
            }
        })

        query = middle.query
        replacements = {...middle.replacements}
        stopQuery = middle.stopQuery
        if (!stopQuery) {
            const [results] = await sequelize.query(query, {
                replacements,
                type: 'SELECT',
            });
    
            const result = results[0] as { total: string | null };
            return result.total ? parseFloat(result.total) : 0;
        } else 
            return 0


    } catch (error) {
        throw new BadRequestException('Database error: ' + error.message);
    }
}