import { TypeReference } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { Reference } from 'src/references/reference.model';
import { queryKor } from 'src/reports/querys/queryKor';

export const outIncome = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    debetSchet: Schet,
    kreditSchet: Schet,
    typeReference: TypeReference,
    reportId: string,
    typeReport: 'income' | 'out',
    bySecondSubconto: boolean,
    oborotsService: OborotsService
) => {
    let result: { name: string, value: number }[] = [];
    let filteredData: Reference[] = [];

    if (data && data.length > 0) {
        filteredData = data.filter((item: Reference) => item?.typeReference == typeReference);
    }

    console.log('debetSchet', debetSchet)
    // Собираем все запросы параллельно
    const totalPromise = typeReport == 'out' ?
        queryKor(debetSchet, kreditSchet, TypeQuery.OKS, startDate, endDate, null, null, null, oborotsService) :
        queryKor(debetSchet, kreditSchet, TypeQuery.ODS, startDate, endDate, null, null, null, oborotsService);

    const valuePromises = filteredData.map(item => {
        const queryType = typeReport == 'out' ? TypeQuery.ODS : TypeQuery.OKS;
        return queryKor(debetSchet, kreditSchet, queryType, startDate, endDate, 
            bySecondSubconto ? null : item.id, bySecondSubconto ? item.id : null, null, oborotsService);
    });

    const [total, ...values] = await Promise.all([totalPromise, ...valuePromises]);

    // Формируем result
    filteredData.forEach((item, index) => {
        const value = values[index];
        if (value) {
            result.push({ name: item.name, value });
        }
    });

    const output = {
        innerReportType: reportId,
        total,
        innerValues: [...result]
    };
    console.log(output);
    return output;

    return {}
};