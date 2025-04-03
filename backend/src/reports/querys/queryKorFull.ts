import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { OK } from './queryKorFullComponents/OK';
import { OS } from './queryKorFullComponents/OS';
import { OborotsService } from 'src/oborots/oborots.service';

export const queryKorFull = async (
    debet: Schet,
    kredit: Schet,
    typeQuery: TypeQuery,
    startDate: number | null,
    endDate: number | null,
    debetFirstSubcontoId: number | null, 
    debetSecondSubcontoId: number | null,
    debetThirdSubcontoId: number | null,
    kreditFirstSubcontoId: number | null, 
    kreditSecondSubcontoId: number | null,
    kreditThirdSubcontoId: number | null,
    oborotsService: OborotsService): Promise<number> => {

    try {
        
        switch (typeQuery) {
            case TypeQuery.OS: return await OS(
                    debet, kredit, typeQuery, startDate, endDate, debetFirstSubcontoId, 
                    debetSecondSubcontoId, debetThirdSubcontoId, kreditFirstSubcontoId, 
                    kreditSecondSubcontoId, kreditThirdSubcontoId, oborotsService)
            case TypeQuery.OK: return await OK(
                    debet, kredit, typeQuery, startDate, endDate, debetFirstSubcontoId, 
                    debetSecondSubcontoId, debetThirdSubcontoId, kreditFirstSubcontoId, 
                    kreditSecondSubcontoId, kreditThirdSubcontoId, oborotsService)
        }

        return 0

    } catch (error) {
        throw new BadRequestException('Database error: ' + error.message);
    }
}