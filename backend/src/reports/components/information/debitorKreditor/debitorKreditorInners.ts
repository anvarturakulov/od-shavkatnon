import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { query } from 'src/report/helpers/querys/query';

const valueDK = (
    type: 'start' | 'end',
    schet: Schet,
    startDate: number,
    endDate: number,
    firstSubconto: string,
    secondSubconto: string,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    const PDSUM = query(schet, TypeQuery.PDSUM, startDate, endDate, firstSubconto, secondSubconto, globalEntrys)
    const PKSUM = query(schet, TypeQuery.PKSUM, startDate, endDate, firstSubconto, secondSubconto, globalEntrys)
    const TDSUM = query(schet, TypeQuery.TDSUM, startDate, endDate, firstSubconto, secondSubconto, globalEntrys)
    const TKSUM = query(schet, TypeQuery.TKSUM, startDate, endDate, firstSubconto, secondSubconto, globalEntrys)
      
    const valueStart = PDSUM - PKSUM 
    const valueEnd = PDSUM - PKSUM + TDSUM - TKSUM

    return type == 'start' ? valueStart : valueEnd
    
}

export const debitorKreditorInners = (
    data: any,
    startDate: number,
    endDate: number,
    schet: Schet,
    reference: TypeReference,
    reportId: string,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let innersDebitStart = [];
    let innersKreditStart = [];
    let innersDebitEnd = [];
    let innersKreditEnd = [];
    
    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == reference)
    .filter((item: any) => {
        if (reportId == 'DELIVERY') return item?.delivery
        if (reportId == 'FILIAL') return item?.filial
        if (reportId == 'BUXGALTER') return (item?.buxgalter || item?.director)
        // if (reportId == 'FOUNDERS') return item?.
        return true
    })
    .forEach((item: ReferenceModel) => {
        let firstSubconto, secondSubconto;
        if (reference == TypeReference.TMZ) {
            firstSubconto = ''
            secondSubconto = item._id
        } else {
            firstSubconto = item._id
            secondSubconto = ''
        }

        let valueStart = valueDK('start',schet, startDate, endDate, firstSubconto, secondSubconto, globalEntrys)                 
        let valueEnd = valueDK('end', schet, startDate, endDate, firstSubconto, secondSubconto, globalEntrys)                 
        
        let elementStart = {
            name: item.name,
            value: valueStart
        }

        let elementEnd = {
            name: item.name,
            value: valueEnd
        }
        
        if (valueStart>0) {
            innersDebitStart.push(elementStart)
        }
        
        if (valueStart<0) {
            elementStart.value = elementStart.value * (-1)
            innersKreditStart.push(elementStart)
        }

        if (valueEnd>0) {
            innersDebitEnd.push(elementEnd)
        }
        
        if (valueEnd<0) {
            elementEnd.value = elementEnd.value * (-1)
            innersKreditEnd.push(elementEnd)
        }
    })
    
    return {
        innerReportType: reportId,
        totalDebitStart: innersDebitStart.reduce((acc, item: any) => acc + item?.value, 0),
        totalKreditStart: innersKreditStart.reduce((acc, item: any) => acc + item?.value, 0), 
        innersDebitStart : [...innersDebitStart],
        innersKreditStart : [...innersKreditStart],

        totalDebitEnd: innersDebitEnd.reduce((acc, item: any) => acc + item?.value, 0),
        totalKreditEnd: innersKreditEnd.reduce((acc, item: any) => acc + item?.value, 0), 
        innersDebitEnd : [...innersDebitEnd],
        innersKreditEnd : [...innersKreditEnd]
    }
} 
