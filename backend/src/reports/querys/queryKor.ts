import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { ODS } from './queryKorComponents/ODS';
import { ODK } from './queryKorComponents/ODK';
import { OKS } from './queryKorComponents/OKS';
import { OKK } from './queryKorComponents/OKK';

export const queryKor = async (
    debet: Schet,
    kredit: Schet,
    typeQuery: TypeQuery,
    startDate: number,
    endDate: number,
    firstSubcontoId: number | undefined | null, 
    secondSubcontoId: number | undefined | null,
    thirdSubcontoId: number | undefined | null,
    sequelize: Sequelize): Promise<number> => {

    try {
        let replacements: { [key: string]: any } = {};
        let query: string = ''
        let stopQuery: boolean = false
        let middle: {[key: string]: any} = {query, replacements}
        
        middle = (() => {
            switch (typeQuery) {
                case TypeQuery.ODS: return {...ODS(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
                case TypeQuery.ODK: return {...ODK(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
                case TypeQuery.OKS: return {...OKS(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
                case TypeQuery.OKK: return {...OKK(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}    
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