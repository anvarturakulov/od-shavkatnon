import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { OK } from './queryKorFullComponents/OK';
import { OS } from './queryKorFullComponents/OS';


export const queryKorFull = async (
    debet: Schet,
    kredit: Schet,
    typeQuery: TypeQuery,
    startDate: number | null,
    endDate: number | null,
    debetFirstSubcontoId: number | undefined | null, 
    debetSecondSubcontoId: number | undefined | null,
    debetThirdSubcontoId: number | undefined | null,
    kreditFirstSubcontoId: number | undefined | null, 
    kreditSecondSubcontoId: number | undefined | null,
    kreditThirdSubcontoId: number | undefined | null,
    sequelize: Sequelize): Promise<number> => {

    try {
        let replacements: { [key: string]: any } = {};
        let query: string = ''
        let stopQuery: boolean = false
        let middle: {[key: string]: any} = {query, replacements}
        
        middle = (() => {
            switch (typeQuery) {
                case TypeQuery.OS: return {...OS(
                    debet, kredit, typeQuery, startDate, endDate, debetFirstSubcontoId, 
                    debetSecondSubcontoId, debetThirdSubcontoId, kreditFirstSubcontoId, 
                    kreditSecondSubcontoId, kreditThirdSubcontoId
                )}
                case TypeQuery.OK: return {...OK(
                    debet, kredit, typeQuery, startDate, endDate, debetFirstSubcontoId, 
                    debetSecondSubcontoId, debetThirdSubcontoId, kreditFirstSubcontoId, 
                    kreditSecondSubcontoId, kreditThirdSubcontoId
                )}
                
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
    
            const parsedObj = JSON.parse(JSON.stringify(results));
            const total = parsedObj?.total;
            return total != null ? Number(total) : 0;

        } else 
            return 0


    } catch (error) {
        throw new BadRequestException('Database error: ' + error.message);
    }
}