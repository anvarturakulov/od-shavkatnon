import { ReferenceModel, TypeReference, TypeSECTION } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { foydaItem } from './foydaItem';
import { zpItemToFoyda } from './zpItemToFoyda';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { Document } from 'src/documents/document.model';
import { queryKor } from 'src/reports/querys/queryKor';

export const foyda = async (
    data: any,
    startDate: number,
    endDate: number,
    firstPrice: number | null,
    secondPrice: number | null,
    sequelize: Sequelize,
    docs: Document[],
    deliverys: Reference[] ) => {
    
    let result:any[] = [];
    let zpUmumBulim = 0;
    let longeChargeUmumBulim = 0;
    let currentPaymentUmumBulim = 0;
    
    if (data && data.length>0) {
        let arrUmumBulim = data.filter((item: any) => item.umumBulim)
        let idUmumBulim = arrUmumBulim[0]._id;
        let filteredData:Reference[] = []

        zpUmumBulim = await zpItemToFoyda(startDate, endDate, idUmumBulim, sequelize)
        //***
        filteredData = data.filter((item: Reference)=> {
            return item.typeReference == TypeReference.CHARGES && item.refValues.longCharge
        })
        for (const item of filteredData) {
            longeChargeUmumBulim += await queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, idUmumBulim, item.id, null, sequelize)
        }

        currentPaymentUmumBulim = await queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, idUmumBulim, null, null, sequelize) 
                                        - longeChargeUmumBulim;

    }

    let filteredData:Reference[] = []
    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == TypeReference.STORAGES && !item.deleted)
    .filter((item: any) => {
        if ( item.filial ) return true
        return false;
    })

    filteredData  = data.filter((item: Reference) => item?.typeReference == TypeReference.STORAGES && !item.refValues.markToDeleted)
                        .filter((item: Reference) => { 
                            if ( item.refValues.typeSection = TypeSECTION.FILIAL ) return true
                            return false;
                        })
        
    for (const item of filteredData) {                    
        let element = await foydaItem(data, startDate, endDate, item.id, item.name, firstPrice, secondPrice, sequelize, docs, deliverys, zpUmumBulim, longeChargeUmumBulim, currentPaymentUmumBulim);
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: 'FOYDA',
        values : [...result]
    }
} 

