import { Sequelize } from 'sequelize-typescript';
import { TypeReference } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { Reference } from 'src/references/reference.model';
import { queryKor } from 'src/reports/querys/queryKor';

export const outIncome = async (
    data: any,
    startDate: number,
    endDate: number,
    debetSchet: Schet,
    kreditSchet: Schet,
    typeReference: TypeReference,
    reportId: string,
    typeReport: 'income' | 'out',
    bySecondSubconto: boolean,
    sequelize: Sequelize
) => {
    
    let result: {name: string, value: number}[] = [];
    let total = typeReport == 'out' ?
                await queryKor(debetSchet, kreditSchet, TypeQuery.OKS, startDate, endDate, null, null, null, sequelize)
              : await queryKor(debetSchet, kreditSchet, TypeQuery.ODS, startDate, endDate, null, null, null, sequelize);
    let filteredData:Reference[] = []
                
    if (data && data.length > 0) {
        filteredData =  data.filter((item: Reference) => item?.typeReference == typeReference)
    }

    for (const item of filteredData) {
        let value: number = typeReport == 'out' ?
                    await queryKor(debetSchet, kreditSchet, TypeQuery.ODS, startDate, endDate, bySecondSubconto ? null : item.id, bySecondSubconto ? item.id : null, null, sequelize)
                  : await queryKor(debetSchet, kreditSchet, TypeQuery.OKS, startDate, endDate, bySecondSubconto ? null : item.id, bySecondSubconto ? item.id : null, null, sequelize);
                  
        let element = {
            name: item.name,
            value
        }
        
        if (value) {
            result.push(element)
        }
    }
    
    
    return {
        innerReportType: reportId,
        total,
        innerValues : [...result]
    }
} 
