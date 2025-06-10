'use client'
import { Schet } from 'src/interfaces/report.interface';
import { debitorKreditorInners } from './debitorKreditorInners';
import { TypeReference } from 'src/interfaces/reference.interface';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';

export const debitorKreditor = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    stocksService: StocksService,
    oborotsService: OborotsService
) => {
    // console.time('DebitorKreditor');

    const tasks = [
        debitorKreditorInners(data, startDate, endDate, Schet.S10, TypeReference.TMZ, 'MATERIAL', stocksService, oborotsService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S21, TypeReference.TMZ, 'ZAGATOVKA', stocksService, oborotsService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'FILIAL', stocksService, oborotsService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'BUXGALTER', stocksService, oborotsService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'DELIVERY', stocksService, oborotsService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S60, TypeReference.PARTNERS, 'PARTNERS', stocksService, oborotsService)
            .then(result => ({ ... result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S66, TypeReference.STORAGES, 'FOUNDERS', stocksService, oborotsService)
            .then(result => ({ ... result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S67, TypeReference.WORKERS, 'WORKERS', stocksService, oborotsService)
            .then(result => ({ ... result })),
    ];


    const result = await Promise.all(tasks);
    // console.timeEnd('DebitorKreditor');
    return result;
};

