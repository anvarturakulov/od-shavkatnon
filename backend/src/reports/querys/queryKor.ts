import { Sequelize } from 'sequelize-typescript';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { BadRequestException } from '@nestjs/common';
import { ODS } from './queryKorComponents/ODS';
import { ODK } from './queryKorComponents/ODK';
import { OKS } from './queryKorComponents/OKS';
import { OKK } from './queryKorComponents/OKK';
import { OborotsService } from 'src/oborots/oborots.service';

function hasKey(obj, key) {
    return obj !== null && typeof obj === 'object' && key in obj;
}

export const queryKor = async (
    debet: Schet,
    kredit: Schet,
    typeQuery: TypeQuery,
    startDate: number | null,
    endDate: number | null,
    firstSubcontoId: number | null, 
    secondSubcontoId: number | null,
    thirdSubcontoId: number | null,
    oborotsService: OborotsService
): Promise<number> => {
    console.log('queryKor called with:', { debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId });

    if (!oborotsService) {
        console.error('oborotsService is undefined');
        throw new BadRequestException('OborotsService is not provided');
    }

    try {
        switch (typeQuery) {
            case TypeQuery.ODS:
                console.log('Calling ODS');
                const odsResult = await ODS(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService);
                console.log('ODS completed:', odsResult);
                return odsResult || 0;
            case TypeQuery.ODK:
                console.log('Calling ODK');
                const odkResult = await ODK(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService);
                console.log('ODK completed:', odkResult);
                return odkResult || 0;
            case TypeQuery.OKS:
                console.log('Calling OKS');
                const oksResult = await OKS(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService);
                console.log('OKS completed:', oksResult);
                return oksResult || 0;
            case TypeQuery.OKK:
                console.log('Calling OKK');
                const okkResult = await OKK(debet, kredit, typeQuery, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, oborotsService);
                console.log('OKK completed:', okkResult);
                return okkResult || 0;
            default:
                console.log('Unknown typeQuery:', typeQuery);
                return 0;
        }
    } catch (error) {
        console.error('Error in queryKor:', error);
        throw new BadRequestException('Database error: ' + error.message);
    }
};