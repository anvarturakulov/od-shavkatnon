import { Sequelize } from 'sequelize-typescript';
import { TypeReference, TypeSECTION, TypeTMZ } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { OborotsService } from 'src/oborots/oborots.service';
import { Reference } from 'src/references/reference.model';
import { query } from 'src/reports/querys/query';
import { StocksService } from 'src/stocks/stocks.service';

const valueDK = async (
    data: any,
    reportId: string,
    type: 'start' | 'end',
    schet: Schet,
    startDate: number | null,
    endDate: number | null,
    firstSubcontoId: number | null,
    secondSubcontoId: number | null,
    thirdSubcontoId: number,
    stocksService: StocksService,
    oborotsService: OborotsService
) => {
    // if (reportId == 'MATERIAL' || reportId == 'ZAGATOVKA') {
    //     let allPOSUM = 0;
    //     let allKOSUM = 0
    //     if (data && data.length > 0) {
    //         const filteredData = data.filter((item: Reference) => {
    //             if (reportId == 'MATERIAL') return item?.refValues.typeTMZ == TypeTMZ.MATERIAL
    //             if (reportId == 'ZAGATOVKA') return item?.refValues.typeTMZ == TypeTMZ.HALFSTUFF
    //             return false
    //         })
        
    //         const tasks = filteredData.map(async (item) => {
    //             let secondSubcontoId;
    //             secondSubcontoId = item.id;
        
    //             const [POSUM, KOSUM] = await Promise.all([
    //                 query(schet, TypeQuery.POSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, stocksService, oborotsService),
    //                 query(schet, TypeQuery.KOSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, null, stocksService, oborotsService),
    //             ]);
        
    //             return { item, POSUM, KOSUM };
    //         });
        
    //         const results = await Promise.all(tasks);
    //         for (const { item, POSUM, KOSUM } of results) {
    //             allPOSUM += POSUM
    //             allKOSUM += KOSUM
    //         }
    //     }

    //     return type === 'start' ? allPOSUM : allKOSUM;
    // }

    const [POSUM, KOSUM] = await Promise.all([
        query(schet, TypeQuery.POSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stocksService, oborotsService),
        query(schet, TypeQuery.KOSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stocksService, oborotsService),
    ]);

    const valueStart = POSUM;
    const valueEnd = KOSUM;

    return type === 'start' ? valueStart : valueEnd;
};


export const debitorKreditorInners = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    schet: Schet,
    typeReference: TypeReference,
    reportId: string,
    stockService: StocksService,
    oborotsService: OborotsService
) => {
    // console.time(`${reportId}-Total`);

    let innersDebitStart: any[] = [];
    let innersKreditStart: any[] = [];
    let innersDebitEnd: any[] = [];
    let innersKreditEnd: any[] = [];
    let filteredData: Reference[] = [];

    if (data && data.length > 0) {
        filteredData = data
            .filter((item: Reference) => item?.typeReference === typeReference)
            .filter((item: Reference) => {
                if (reportId === 'DELIVERY') return item?.refValues.typeSection === TypeSECTION.DELIVERY;
                if (reportId === 'FILIAL') return item?.refValues.typeSection === TypeSECTION.FILIAL;
                if (reportId === 'BUXGALTER') return (
                    item?.refValues.typeSection === TypeSECTION.ACCOUNTANT ||
                    item?.refValues.typeSection === TypeSECTION.STORAGE ||
                    item?.refValues.typeSection === TypeSECTION.DIRECTOR
                );
                return true;
            });
    }

    const tasks = filteredData.map(async (item) => {
        let firstSubcontoId, secondSubcontoId, thirdSubcontoId;

        firstSubcontoId = item.id;
        secondSubcontoId = null;
        thirdSubcontoId = null;

        const [valueStart, valueEnd] = await Promise.all([
            valueDK(data, reportId, 'start', schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stockService, oborotsService),
            valueDK(data, reportId, 'end', schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, stockService, oborotsService),
        ]);

        return { item, valueStart, valueEnd };
    });

    const results = await Promise.all(tasks);

    for (const { item, valueStart, valueEnd } of results) {
        const elementStart = { name: item.name, value: valueStart };
        const elementEnd = { name: item.name, value: valueEnd };

        if (valueStart > 0) innersDebitStart.push(elementStart);
        if (valueStart < 0) {
            elementStart.value = elementStart.value * -1;
            innersKreditStart.push(elementStart);
        }
        if (valueEnd > 0) innersDebitEnd.push(elementEnd);
        if (valueEnd < 0) {
            elementEnd.value = elementEnd.value * -1;
            innersKreditEnd.push(elementEnd);
        }
    }

    const output = {
        innerReportType: reportId,
        totalDebitStart: innersDebitStart.reduce((acc, item: any) => acc + item?.value, 0),
        totalKreditStart: innersKreditStart.reduce((acc, item: any) => acc + item?.value, 0),
        innersDebitStart: [...innersDebitStart],
        innersKreditStart: [...innersKreditStart],
        totalDebitEnd: innersDebitEnd.reduce((acc, item: any) => acc + item?.value, 0),
        totalKreditEnd: innersKreditEnd.reduce((acc, item: any) => acc + item?.value, 0),
        innersDebitEnd: [...innersDebitEnd],
        innersKreditEnd: [...innersKreditEnd],
    };

    // console.timeEnd(`${reportId}-Total`);
    return output;
};