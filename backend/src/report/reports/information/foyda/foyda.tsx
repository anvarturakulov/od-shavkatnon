import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { EntryItem, FoydaPrice, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { foydaItem } from './foydaItem';
import { Document } from 'src/document/models/document.model';
import { ReferenceDocument } from 'src/reference/models/referense.model';
import { zpItemToFoyda } from './zpItemToFoyda';
import { queryKor } from 'src/report/helpers/querys/queryKor';

export const foyda = (
    data: any,
    startDate: number,
    endDate: number,
    foydaPrice: FoydaPrice,
    globalEntrys: Array<EntryItem> | undefined,
    docs: Document[],
    deliverys: ReferenceDocument[] ) => {
    
    let result = [];
    let zpUmumBulim = 0;
    let longeChargeUmumBulim = 0;
    let currentPaymentUmumBulim = 0;
    
    if (data && data.length>0) {
        let arrUmumBulim = data.filter((item: any) => item.umumBulim)
        let idUmumBulim = arrUmumBulim[0]._id;

        zpUmumBulim = zpItemToFoyda(startDate, endDate, idUmumBulim, globalEntrys)
        //***
        data && data.length &&
        data
        .filter((item: ReferenceModel)=> {
            return item.typeReference == TypeReference.CHARGES && item.longCharge
        })
        .forEach((item: ReferenceModel) => {
            longeChargeUmumBulim += queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, String(idUmumBulim), String(item._id), globalEntrys)
        })

        currentPaymentUmumBulim = queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, String(idUmumBulim), '', globalEntrys) - longeChargeUmumBulim;

    }

    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeReference == TypeReference.STORAGES && !item.deleted)
    .filter((item: any) => {
        if ( item.filial ) return true
        return false;
    })
    .forEach((item: ReferenceModel) => {
        let element = foydaItem(data, startDate, endDate, item._id, item.name, foydaPrice, globalEntrys, docs, deliverys, zpUmumBulim, longeChargeUmumBulim, currentPaymentUmumBulim);
        if (Object.keys(element).length) {
            result.push(element)
        }
    })
    
    return {
        reportType: 'FOYDA',
        values : [...result]
    }
} 

