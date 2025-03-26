'use client'
import { Schet } from 'src/interfaces/report.interface';
import { debitorKreditorInners } from './debitorKreditorInners';
import { TypeReference } from 'src/interfaces/reference.interface';
import { Sequelize } from 'sequelize-typescript';
import { StocksService } from 'src/stocks/stocks.service';

export const debitorKreditorOld = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize,
    stockService: StocksService
    ) => {
    let result:any[] = []

    let material = await debitorKreditorInners(data, startDate, endDate, Schet.S10, TypeReference.TMZ, 'MATERIAL', sequelize, stockService)
    result.push(material);

    let zagatovka = await debitorKreditorInners(data, startDate, endDate, Schet.S21, TypeReference.TMZ, 'ZAGATOVKA', sequelize, stockService)
    result.push(zagatovka);
    
    let filial = await debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'FILIAL', sequelize, stockService)
    result.push(filial);

    let buxgalter = await debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'BUXGALTER', sequelize, stockService)
    result.push(buxgalter);

    let delivery = await debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'DELIVERY', sequelize, stockService)
    result.push(delivery);

    let partners = await debitorKreditorInners(data, startDate, endDate, Schet.S60, TypeReference.PARTNERS, 'PARTNERS', sequelize, stockService)
    result.push(partners);

    let founders = await debitorKreditorInners(data, startDate, endDate, Schet.S66, TypeReference.STORAGES, 'FOUNDERS', sequelize, stockService)
    result.push(founders);

    let workers = await debitorKreditorInners(data, startDate, endDate, Schet.S67, TypeReference.WORKERS, 'WORKERS', sequelize, stockService)
    result.push(workers);
    
    return result
    
} 

export const debitorKreditor = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize,
    stocksService: StocksService
) => {
    console.time('DebitorKreditor');

    const tasks = [
        debitorKreditorInners(data, startDate, endDate, Schet.S10, TypeReference.STORAGES, 'MATERIAL', sequelize, stocksService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S21, TypeReference.STORAGES, 'ZAGATOVKA', sequelize, stocksService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'FILIAL', sequelize, stocksService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'BUXGALTER', sequelize, stocksService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'DELIVERY', sequelize, stocksService)
            .then(result => ({ ...result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S60, TypeReference.PARTNERS, 'PARTNERS', sequelize, stocksService)
            .then(result => ({ ... result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S66, TypeReference.STORAGES, 'FOUNDERS', sequelize, stocksService)
            .then(result => ({ ... result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S67, TypeReference.WORKERS, 'WORKERS', sequelize, stocksService)
            .then(result => ({ ... result })),
    ];


    const result = await Promise.all(tasks);
    console.log('Result size:', JSON.stringify(result).length / 1024 / 1024, 'MB');
    console.timeEnd('DebitorKreditor');
    return result;
};

