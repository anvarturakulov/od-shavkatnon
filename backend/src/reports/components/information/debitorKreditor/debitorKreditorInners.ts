import { Sequelize } from 'sequelize-typescript';
import { TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Reference } from 'src/references/reference.model';
import { query } from 'src/reports/querys/query';

// const valueDK = async (
//     type: 'start' | 'end',
//     schet: Schet,
//     startDate: number | null,
//     endDate: number | null,
//     firstSubcontoId: number,
//     secondSubcontoId: number,
//     thirdSubcontoId: number,
//     sequelize: Sequelize ) => {
    
//     const PDSUM = await query(schet, TypeQuery.PDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize)
//     const PKSUM = await query(schet, TypeQuery.PKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize)
//     const TDSUM = await query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize)
//     const TKSUM = await query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize)
      
//     const valueStart = PDSUM - PKSUM 
//     const valueEnd = PDSUM - PKSUM + TDSUM - TKSUM

//     return type == 'start' ? valueStart : valueEnd
    
// }

// export const debitorKreditorInners = async (
//     data: any,
//     startDate: number | null,
//     endDate: number | null,
//     schet: Schet,
//     typeReference: TypeReference,
//     reportId: string,
//     sequelize: Sequelize ) => {

//     console.time(`${reportId}-Total`);
    
//     let innersDebitStart:any[] = [];
//     let innersKreditStart:any[] = [];
//     let innersDebitEnd:any[] = [];
//     let innersKreditEnd:any[] = [];
//     let filteredData:Reference[] = []
//     data && 
//     data.length > 0 &&
//     data

//     if (data && data.length > 0) {
//         filteredData =  data.filter((item: Reference) => item?.typeReference == typeReference)
//                             .filter((item: Reference) => {
//                                 if (reportId == 'DELIVERY') return item?.refValues.typeSection == TypeSECTION.DELIVERY
//                                 if (reportId == 'FILIAL') return item?.refValues.typeSection == TypeSECTION.FILIAL
//                                 if (reportId == 'BUXGALTER') return (
//                                     item?.refValues.typeSection == TypeSECTION.ACCOUNTANT ||
//                                     item?.refValues.typeSection == TypeSECTION.DIRECTOR
//                                 )
//                                 return true
//                             })
//     }

//     for (const item of filteredData) {
        
//         let firstSubcontoId, secondSubcontoId, thirdSubcontoId;
//         if (typeReference == TypeReference.TMZ) {
//             firstSubcontoId = null
//             secondSubcontoId = item.id
//             thirdSubcontoId = null
//         } else {
//             firstSubcontoId = item.id
//             secondSubcontoId = null
//             thirdSubcontoId = null
//         }

//         let valueStart = await valueDK('start',schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize)                 
//         let valueEnd = await valueDK('end', schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize)                 
        
//         let elementStart = {
//             name: item.name,
//             value: valueStart
//         }

//         let elementEnd = {
//             name: item.name,
//             value: valueEnd
//         }
        
//         if (valueStart>0) {
//             innersDebitStart.push(elementStart)
//         }
        
//         if (valueStart<0) {
//             elementStart.value = elementStart.value * (-1)
//             innersKreditStart.push(elementStart)
//         }

//         if (valueEnd>0) {
//             innersDebitEnd.push(elementEnd)
//         }
        
//         if (valueEnd<0) {
//             elementEnd.value = elementEnd.value * (-1)
//             innersKreditEnd.push(elementEnd)
//         }
//     }
    
//     return {
//         innerReportType: reportId,
//         totalDebitStart: innersDebitStart.reduce((acc, item: any) => acc + item?.value, 0),
//         totalKreditStart: innersKreditStart.reduce((acc, item: any) => acc + item?.value, 0), 
//         innersDebitStart : [...innersDebitStart],
//         innersKreditStart : [...innersKreditStart],

//         totalDebitEnd: innersDebitEnd.reduce((acc, item: any) => acc + item?.value, 0),
//         totalKreditEnd: innersKreditEnd.reduce((acc, item: any) => acc + item?.value, 0), 
//         innersDebitEnd : [...innersDebitEnd],
//         innersKreditEnd : [...innersKreditEnd]
//     }
// } 

const valueDK = async (
    type: 'start' | 'end',
    schet: Schet,
    startDate: number | null,
    endDate: number | null,
    firstSubcontoId: number,
    secondSubcontoId: number,
    thirdSubcontoId: number,
    sequelize: Sequelize
) => {
    const [PDSUM, PKSUM, TDSUM, TKSUM] = await Promise.all([
        query(schet, TypeQuery.PDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize),
        query(schet, TypeQuery.PKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize),
        query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize),
        query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize),
    ]);

    const valueStart = PDSUM - PKSUM;
    const valueEnd = valueStart + TDSUM - TKSUM;

    return type === 'start' ? valueStart : valueEnd;
};


export const debitorKreditorInners = async (
    data: any,
    startDate: number | null,
    endDate: number | null,
    schet: Schet,
    typeReference: TypeReference,
    reportId: string,
    sequelize: Sequelize
) => {
    console.time(`${reportId}-Total`);

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
                    item?.refValues.typeSection === TypeSECTION.DIRECTOR
                );
                return true;
            });
    }

    const tasks = filteredData.map(async (item) => {
        let firstSubcontoId, secondSubcontoId, thirdSubcontoId;
        if (typeReference === TypeReference.TMZ) {
            firstSubcontoId = null;
            secondSubcontoId = item.id;
            thirdSubcontoId = null;
        } else {
            firstSubcontoId = item.id;
            secondSubcontoId = null;
            thirdSubcontoId = null;
        }

        const [valueStart, valueEnd] = await Promise.all([
            valueDK('start', schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize),
            valueDK('end', schet, startDate, endDate, firstSubcontoId, secondSubcontoId, thirdSubcontoId, sequelize),
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

    console.timeEnd(`${reportId}-Total`);
    return output;
};