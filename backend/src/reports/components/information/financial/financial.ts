'use client'
import { EntryItem, Schet } from 'src/interfaces/report.interface';
import { outIncome } from './outIncome';
import { TypeReference } from 'src/interfaces/reference.interface';

export const financial = (
    data: any,
    startDate: number,
    endDate: number,
    globalEntrys: Array<EntryItem> | undefined,
    ) => {
    let result = []

    let outZP = outIncome(data, startDate, endDate, Schet.S67, Schet.S50, TypeReference.WORKERS, 'outZP', 'out', false, globalEntrys)
    result.push(outZP);

    let outPartner = outIncome(data, startDate, endDate, Schet.S60, Schet.S50, TypeReference.PARTNERS, 'outPartner', 'out', false, globalEntrys)
    result.push(outPartner);

    let outFounder = outIncome(data, startDate, endDate, Schet.S66, Schet.S50, TypeReference.STORAGES, 'outFounder', 'out', false, globalEntrys)
    result.push(outFounder);

    let outCharge = outIncome(data, startDate, endDate, Schet.S20, Schet.S50, TypeReference.CHARGES, 'outCharge', 'out', true, globalEntrys)
    result.push(outCharge);

    let incomeSale = outIncome(data, startDate, endDate, Schet.S40, Schet.S28, TypeReference.STORAGES, 'incomeSale', 'income', false, globalEntrys)
    result.push(incomeSale);

    let incomeOther = outIncome(data, startDate, endDate, Schet.S50, Schet.S60, TypeReference.PARTNERS, 'incomeOther', 'income', false, globalEntrys)
    result.push(incomeOther);

    return result
    
} 