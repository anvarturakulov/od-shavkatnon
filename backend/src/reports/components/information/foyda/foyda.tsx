import { TypeReference, TypeSECTION, TypeTMZ } from 'src/interfaces/reference.interface';
import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { foydaItem } from './foydaItem';
import { zpItemToFoyda } from './zpItemToFoyda';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { queryKor } from 'src/reports/querys/queryKor';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { DocumentsService } from 'src/documents/documents.service';
import { DocumentType } from 'src/interfaces/document.interface';
import { Document } from 'src/documents/document.model';

const getValue = (jsonString: string, key: string) => {
    try{
      const object = JSON.parse(jsonString)
      if (key in object) return object[key]
      return undefined
    } catch {
      return undefined
    }
}

export const foyda = async (
    data: any,
    startDate: number | null ,
    endDate: number | null ,
    sequelize: Sequelize,
    deliverys: Reference[],
    stockService: StocksService,
    oborotsService: OborotsService,
    documentsService: DocumentsService
) => {
    
    let result:any[] = [];
    let zpUmumBulim = 0;
    let longeChargeUmumBulim = 0;
    let currentPaymentUmumBulim = 0;
    
    const docsComeProduct:Document[] = await documentsService.getAllDocumentsByType(DocumentType.ComeProduct)
    const docsMoveProduct:Document[] = await documentsService.getAllDocumentsByType(DocumentType.MoveProd)
    
    const arrUmumBulim = data.filter((item: Reference) => item.refValues.typeSection == TypeSECTION.COMMON)
    const idUmumBulim = arrUmumBulim[0]._id | 0;

    const arrUmumProduct = data.filter((item: Reference) => {
        const commonProduct = item.refValues.comment ? getValue(item.refValues.comment, 'common') : false
        
        return (
            item.typeReference = TypeReference.TMZ &&
            item.refValues.typeTMZ == TypeTMZ.PRODUCT &&
            commonProduct
        )
    })
    const idUmumProduct = arrUmumProduct[0]._id | 0;

    // if (data && data.length>0) {
    //     let arrUmumBulim = data.filter((item: Reference) => item.refValues.typeSection == TypeSECTION.COMMON)
        
    //     let idUmumBulim = arrUmumBulim[0]._id;
    //     let filteredData:Reference[] = []

    //     zpUmumBulim = await zpItemToFoyda(startDate, endDate, idUmumBulim, oborotsService)
    //     //***
    //     filteredData = data.filter((item: Reference)=> {
    //         return item.typeReference == TypeReference.CHARGES && item.refValues.longCharge
    //     })
    //     for (const item of filteredData) {
    //         longeChargeUmumBulim += await queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, idUmumBulim, item.id, null, oborotsService)
    //     }

    //     currentPaymentUmumBulim = await queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, idUmumBulim, null, null, oborotsService) 
    //                                     - longeChargeUmumBulim;

    // }

    let filteredData:Reference[] = []
    
    data && data.length > 0 && data
    .filter((item: any) => item?.typeReference == TypeReference.STORAGES && !item.deleted)
    .filter((item: any) => {
        if ( item.filial ) return true
        return false;
    })

    filteredData  = data.filter((item: Reference) => {
                        return (
                            item?.typeReference == TypeReference.STORAGES && 
                            !item.refValues.markToDeleted && 
                            item.refValues.typeSection == TypeSECTION.FILIAL
                        )
                    })
        
    for (const item of filteredData) {                    
        let element = await foydaItem(data, deliverys, docsComeProduct, docsMoveProduct, startDate, endDate, item.id, item.name, idUmumBulim, idUmumProduct, sequelize, stockService, oborotsService);
        if (Object.keys(element).length) {
            result.push(element)
        }
    }
    
    return {
        reportType: 'FOYDA',
        values : [...result]
    }
} 

