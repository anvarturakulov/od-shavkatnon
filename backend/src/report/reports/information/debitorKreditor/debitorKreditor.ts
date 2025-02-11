'use client'
import { EntryItem, Schet } from 'src/interfaces/report.interface';
import { debitorKreditorInners } from './debitorKreditorInners';
import { TypeReference } from 'src/interfaces/reference.interface';

export const debitorKreditor = (
    data: any,
    startDate: number,
    endDate: number,
    globalEntrys: Array<EntryItem> | undefined,
    ) => {
    let result = []

    let material = debitorKreditorInners(data, startDate, endDate, Schet.S10, TypeReference.TMZ, 'MATERIAL', globalEntrys)
    result.push(material);

    let zagatovka = debitorKreditorInners(data, startDate, endDate, Schet.S21, TypeReference.TMZ, 'ZAGATOVKA', globalEntrys)
    result.push(zagatovka);
    
    let filial = debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'FILIAL', globalEntrys)
    result.push(filial);

    let buxgalter = debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'BUXGALTER', globalEntrys)
    result.push(buxgalter);

    let delivery = debitorKreditorInners(data, startDate, endDate, Schet.S50, TypeReference.STORAGES, 'DELIVERY', globalEntrys)
    result.push(delivery);

    let partners = debitorKreditorInners(data, startDate, endDate, Schet.S60, TypeReference.PARTNERS, 'PARTNERS', globalEntrys)
    result.push(partners);

    let founders = debitorKreditorInners(data, startDate, endDate, Schet.S66, TypeReference.STORAGES, 'FOUNDERS', globalEntrys)
    result.push(founders);

    let workers = debitorKreditorInners(data, startDate, endDate, Schet.S67, TypeReference.WORKERS, 'WORKERS', globalEntrys)
    result.push(workers);
    
    return result
    
} 