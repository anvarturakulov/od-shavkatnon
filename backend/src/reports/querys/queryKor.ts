import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { ODS } from './queryKorComponents/ODS';
import { ODK } from './queryKorComponents/ODK';
import { OKS } from './queryKorComponents/OKS';
import { OKK } from './queryKorComponents/OKK';

function hasKey(obj, key) {
    return obj !== null && typeof obj === 'object' && key in obj;
}

export const queryKor = async (
    debet: Schet,
    kredit: Schet,
    typeQuery: TypeQuery,
    startDate: number | null,
    endDate: number | null,
    firstSubcontoId: number | undefined | null, 
    secondSubcontoId: number | undefined | null,
    thirdSubcontoId: number | undefined | null,
    sequelize: Sequelize): Promise<number> => {

    try {
        let replacements: { [key: string]: any } = {};
        let query: string = ''
        let stopQuery: boolean = false
        let middle: {[key: string]: any} = {query, replacements}
        
        const middleStart = ((typeQuery: TypeQuery) => {
            switch (typeQuery) {
                case TypeQuery.ODS: return {...ODS(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
                case TypeQuery.ODK: return {...ODK(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
                case TypeQuery.OKS: return {...OKS(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}
                case TypeQuery.OKK: return {...OKK(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId)}    
                }
        })

        middle = {...middleStart(typeQuery)}

        query = middle.query
        replacements = {...middle.replacements}
        stopQuery = middle.stopQuery
        
        if (!stopQuery) {
            
            const [results] = await sequelize.query(query, {
                replacements,
                type: 'SELECT',
            });

            const parsedObj = JSON.parse(JSON.stringify(results));
            const total = parsedObj?.total;
            return total != null ? Number(total) : 0;
            
        } else 
            return 0


    } catch (error) {
        throw new BadRequestException('Database error: ' + error.message);
    }
}