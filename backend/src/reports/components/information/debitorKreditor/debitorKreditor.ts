'use client'
import { Schet } from 'src/interfaces/report.interface';
import { debitorKreditorInners } from './debitorKreditorInners';
import { TypeReference } from 'src/interfaces/reference.interface';
import { Sequelize } from 'sequelize-typescript';

export const debitorKreditorOld = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize,
    ) => {
    let result:any[] = []

    let material = await debitorKreditorInners(data, startDate, endDate, Schet.S10, TypeReference.TMZ, 'MATERIAL', sequelize)
    result.push(material);

    let zagatovka = await debitorKreditorInners(data, startDate, endDate, Schet.S21, TypeReference.TMZ, 'ZAGATOVKA', sequelize)
    result.push(zagatovka);
    
    let filial = await debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'FILIAL', sequelize)
    result.push(filial);

    let buxgalter = await debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'BUXGALTER', sequelize)
    result.push(buxgalter);

    let delivery = await debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'DELIVERY', sequelize)
    result.push(delivery);

    let partners = await debitorKreditorInners(data, startDate, endDate, Schet.S60, TypeReference.PARTNERS, 'PARTNERS', sequelize)
    result.push(partners);

    let founders = await debitorKreditorInners(data, startDate, endDate, Schet.S66, TypeReference.STORAGES, 'FOUNDERS', sequelize)
    result.push(founders);

    let workers = await debitorKreditorInners(data, startDate, endDate, Schet.S67, TypeReference.WORKERS, 'WORKERS', sequelize)
    result.push(workers);
    
    return result
    
} 

export const debitorKreditor = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize,
) => {
    console.time('DebitorKreditor');

    const tasks = [
        debitorKreditorInners(data, startDate, endDate, Schet.S10, TypeReference.TMZ, 'MATERIAL', sequelize)
            .then(result => ({ type: 'MATERIAL', values: result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S21, TypeReference.TMZ, 'ZAGATOVKA', sequelize)
            .then(result => ({ type: 'ZAGATOVKA', values: result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'FILIAL', sequelize)
            .then(result => ({ type: 'FILIAL', values: result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'BUXGALTER', sequelize)
            .then(result => ({ type: 'BUXGALTER', values: result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'DELIVERY', sequelize)
            .then(result => ({ type: 'DELIVERY', values: result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S60, TypeReference.PARTNERS, 'PARTNERS', sequelize)
            .then(result => ({ type: 'PARTNERS', values: result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S66, TypeReference.STORAGES, 'FOUNDERS', sequelize)
            .then(result => ({ type: 'FOUNDERS', values: result })),
        debitorKreditorInners(data, startDate, endDate, Schet.S67, TypeReference.WORKERS, 'WORKERS', sequelize)
            .then(result => ({ type: 'WORKERS', values: result })),
    ];

    const result = await Promise.all(tasks);

    console.timeEnd('DebitorKreditor');
    return result;
};

