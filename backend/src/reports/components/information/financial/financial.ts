import { Schet } from 'src/interfaces/report.interface';
import { outIncome } from './outIncome';
import { TypeReference } from 'src/interfaces/reference.interface';
import { OborotsService } from 'src/oborots/oborots.service';

export const financial = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    oborotsService: OborotsService
) => {
    const promises = [
        outIncome(data, startDate, endDate, Schet.S67, Schet.S50, TypeReference.WORKERS, 'outZP', 'out', false, oborotsService),
        outIncome(data, startDate, endDate, Schet.S60, Schet.S50, TypeReference.PARTNERS, 'outPartner', 'out', false, oborotsService),
        outIncome(data, startDate, endDate, Schet.S66, Schet.S50, TypeReference.STORAGES, 'outFounder', 'out', false, oborotsService),
        outIncome(data, startDate, endDate, Schet.S20, Schet.S50, TypeReference.CHARGES, 'outCharge', 'out', true, oborotsService),
        outIncome(data, startDate, endDate, Schet.S40, Schet.S28, TypeReference.STORAGES, 'incomeSale', 'income', false, oborotsService),
        outIncome(data, startDate, endDate, Schet.S50, Schet.S60, TypeReference.PARTNERS, 'incomeOther', 'income', false, oborotsService),
        outIncome(data, startDate, endDate, Schet.S41, Schet.S28, TypeReference.STORAGES, 'incomeOrder', 'income', false, oborotsService),
    ];
    
    const results = await Promise.all(promises);
    return results;
};