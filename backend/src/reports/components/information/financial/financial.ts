'use client'
import { Schet } from 'src/interfaces/report.interface';
import { outIncome } from './outIncome';
import { TypeReference } from 'src/interfaces/reference.interface';
import { Sequelize } from 'sequelize-typescript';

export const financial = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    sequelize: Sequelize
    ) => {
    let result:any[] = []

    let outZP = await outIncome(data, startDate, endDate, Schet.S67, Schet.S50, TypeReference.WORKERS, 'outZP', 'out', false, sequelize)
    result.push(outZP);

    let outPartner = await outIncome(data, startDate, endDate, Schet.S60, Schet.S50, TypeReference.PARTNERS, 'outPartner', 'out', false, sequelize)
    result.push(outPartner);

    let outFounder = await outIncome(data, startDate, endDate, Schet.S66, Schet.S50, TypeReference.STORAGES, 'outFounder', 'out', false, sequelize)
    result.push(outFounder);

    let outCharge = await outIncome(data, startDate, endDate, Schet.S20, Schet.S50, TypeReference.CHARGES, 'outCharge', 'out', true, sequelize)
    result.push(outCharge);

    let incomeSale = await outIncome(data, startDate, endDate, Schet.S40, Schet.S28, TypeReference.STORAGES, 'incomeSale', 'income', false, sequelize)
    result.push(incomeSale);

    let incomeOther = await outIncome(data, startDate, endDate, Schet.S50, Schet.S60, TypeReference.PARTNERS, 'incomeOther', 'income', false, sequelize)
    result.push(incomeOther);

    return result
    
} 