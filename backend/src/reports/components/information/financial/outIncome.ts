import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';

export const outIncome = (
    data: any,
    startDate: number,
    endDate: number,
    debetSchet: Schet,
    kreditSchet: Schet,
    reference: TypeReference,
    reportId: string,
    typeReport: 'income' | 'out',
    bySecondSubconto: boolean,
    globalEntrys: Array<EntryItem> | undefined ) => {
    
    let result = [];
    let total = typeReport == 'out' ?
                queryKor(debetSchet, kreditSchet, TypeQuery.OKS, startDate, endDate, '', '', globalEntrys)
              : queryKor(debetSchet, kreditSchet, TypeQuery.ODS, startDate, endDate, '', '', globalEntrys);
    
                
    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == reference)
    .forEach((item: ReferenceModel) => {
        let value = typeReport == 'out' ?
                    queryKor(debetSchet, kreditSchet, TypeQuery.ODS, startDate, endDate, bySecondSubconto ? '' : String(item._id), bySecondSubconto ? String(item._id) : '', globalEntrys)
                  : queryKor(debetSchet, kreditSchet, TypeQuery.OKS, startDate, endDate, bySecondSubconto ? '' : String(item._id), bySecondSubconto ? String(item._id) : '', globalEntrys);
                  
        let element = {
            name: item.name,
            value
        }
        
        if (value) {
            result.push(element)
        }
    })
    
    return {
        innerReportType: reportId,
        total,
        innerValues : [...result]
    }
} 
