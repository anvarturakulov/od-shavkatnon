import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { TypeReference, TypeTMZ } from 'src/interfaces/reference.interface';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { queryKor } from 'src/reports/querys/queryKor';
import { StocksService } from 'src/stocks/stocks.service';
import { OborotsService } from 'src/oborots/oborots.service';
import { Document } from 'src/documents/document.model';
import { DocSTATUS, DocumentType } from 'src/interfaces/document.interface';
import { query } from 'src/reports/querys/query';

const isDelivery = (deliverys:Reference[], id:number) => {
  if (deliverys && deliverys.length) {
    let length = deliverys.filter((item:Reference)=> item.id == id).length
    if (length) return true
  }
  return false
}

export const foydaSubItem = async ( 
  data: any,
  docsComeProduct: Document[],
  docsMoveProduct: Document[],
  deliverys: Reference[],
  startDate: number | null,
  endDate: number | null,
  sectionId: number,
  productId: number, 
  productTitle: string,
  productComment: string | undefined,
  idUmumBulim: number, 
  idUmumProduct: number,
  sequelize: Sequelize,
  stockService: StocksService,
  oborotsService: OborotsService
) => {

    let countOutToDelivery = 0;
    let countIncomeFromDelivery = 0;
    let comeProductDocsBySection = 0
    let comeProductDocsByProduct = 0 


    if (startDate != null && endDate != null && docsComeProduct && docsComeProduct.length > 0) {
      comeProductDocsBySection = docsMoveProduct.filter((item:Document) => {
        return (
          item.date>= startDate && 
          item.date <= endDate && 
          item.docStatus == DocSTATUS.PROVEDEN &&
          item.docValues.receiverId == sectionId
      )}
      ).length

      comeProductDocsByProduct = docsComeProduct.filter((item:Document) => {
        return (
          item.date>= startDate && 
          item.date <= endDate && 
          item.docStatus == DocSTATUS.PROVEDEN &&
          item.docValues.receiverId == sectionId &&
          item.docValues.analiticId == productId 
      )}
      ).length

    }

    if (startDate != null && endDate != null && docsMoveProduct && docsMoveProduct.length > 0) {
      countOutToDelivery = docsMoveProduct.filter((item:Document) => {
        return (
          item.date>= startDate && 
          item.date <= endDate && 
          item.docStatus == DocSTATUS.PROVEDEN &&
          item.documentType == DocumentType.MoveProd &&
          item.docValues.senderId == sectionId  &&
          isDelivery(deliverys, item.docValues.receiverId) &&
          item.docValues.analiticId == productId
      )}
      ).reduce((total, item:Document) => total + item.docValues.count, 0)

      countIncomeFromDelivery = docsMoveProduct.filter((item:Document) => {
        return (
          item.date>= startDate && 
          item.date <= endDate && 
          item.docStatus == DocSTATUS.PROVEDEN &&
          item.documentType == DocumentType.MoveProd &&
          item.docValues.receiverId == sectionId  &&
          isDelivery(deliverys, item.docValues.senderId) &&
          item.docValues.analiticId == productId
        )
      }).reduce((total, item:Document) => total + item.docValues.count, 0)

    }

    const POKOL = await query(Schet.S28, TypeQuery.POKOL, startDate, endDate, sectionId, productId, null, stockService, oborotsService)
    const KOKOL = await query(Schet.S28, TypeQuery.KOKOL, startDate, endDate, sectionId, productId,  null, stockService, oborotsService)

    const startCount = POKOL;
    const endCount = KOKOL;

    const productionCountAllBySection = await queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, sectionId, null, null, oborotsService);
    const productionCount = await queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, sectionId, productId, null, oborotsService);

    const brakCount = await queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, sectionId, productId, null, oborotsService);
    const moveOutCount = await queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, sectionId, productId, null, oborotsService);
    const moveIncomeCount = await queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, sectionId, productId, null, oborotsService);
    const sale = await queryKor(Schet.S40, Schet.S28, TypeQuery.OKS, startDate, endDate, sectionId, productId, null, oborotsService) + 
                 await queryKor(Schet.S41, Schet.S28, TypeQuery.OKS, startDate, endDate, sectionId, productId, null, oborotsService)    ;

    const countDeleviry = (countOutToDelivery-countIncomeFromDelivery) <= 0 ? 0 : (countOutToDelivery-countIncomeFromDelivery)   
    const saleCountWithOutMove = startCount + productionCount - brakCount - moveOutCount + moveIncomeCount - endCount;
    
    let dAll = countDeleviry > 0 ? countDeleviry : 0
    let iAll = ( moveIncomeCount - countIncomeFromDelivery ) > 0 ? (moveIncomeCount-countIncomeFromDelivery) : 0
    let oAll = ( moveOutCount - countOutToDelivery ) > 0 ? (moveOutCount - countOutToDelivery ) : 0
    
    
    let d = dAll > 0 ? dAll : 0
    let i = iAll > 0 ? iAll : 0
    let o = oAll > 0 ? oAll : 0
    let saleI = sale > 0 ? sale : 0

    const priceForResult = productComment ? Number(productComment) : 0
    
    const saleWithMove = saleI + (d - i + o) * priceForResult;

    const queries = [
      queryKor(Schet.S20, Schet.S21, TypeQuery.ODS, startDate, endDate, null, null, null, oborotsService), // zagatovkaByCompany
      queryKor(Schet.S20, Schet.S21, TypeQuery.ODS, startDate, endDate, sectionId, null, null, oborotsService), // zagatovkaBySection
      
      queryKor(Schet.S20, Schet.S21, TypeQuery.ODS, startDate, endDate, idUmumBulim, null, null, oborotsService), // zagatovkaUmumBulim
      queryKor(Schet.S20, Schet.S10, TypeQuery.ODS, startDate, endDate, idUmumBulim, null, null, oborotsService), // materialUmumBulim
      queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, startDate, endDate, idUmumBulim, null, null, oborotsService), // zpUmumBulim
      queryKor(Schet.S20, Schet.S60, TypeQuery.ODS, startDate, endDate, idUmumBulim, null, null, oborotsService), // serviceUmumBulim
      queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, idUmumBulim, null, null, oborotsService), // paymentUmumBulim

      queryKor(Schet.S20, Schet.S21, TypeQuery.ODS, startDate, endDate, sectionId, null, productId, oborotsService), // zagatovka
      queryKor(Schet.S20, Schet.S10, TypeQuery.ODS, startDate, endDate, sectionId, null, productId, oborotsService), // material
      queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, startDate, endDate, sectionId, null, productId, oborotsService), // zp
      queryKor(Schet.S20, Schet.S60, TypeQuery.ODS, startDate, endDate, sectionId, null, productId, oborotsService), // service
      queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, sectionId, null, productId, oborotsService), // payment

      queryKor(Schet.S20, Schet.S21, TypeQuery.ODS, startDate, endDate, sectionId, null, idUmumProduct, oborotsService), // zagatovkaUmumProduct
      queryKor(Schet.S20, Schet.S10, TypeQuery.ODS, startDate, endDate, sectionId, null, idUmumProduct, oborotsService), // materialUmumProduct
      queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, startDate, endDate, sectionId, null, idUmumProduct, oborotsService), // zpUmumProduct
      queryKor(Schet.S20, Schet.S60, TypeQuery.ODS, startDate, endDate, sectionId, null, idUmumProduct, oborotsService), // serviceUmumProduct
      queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, sectionId, null, idUmumProduct, oborotsService) // paymentUmumProduct
    ];
    
    // Выполняем все запросы параллельно и ждем их завершения
    const [
      zagatovkaByCompany,
      zagatovkaBySection,
      zagatovkaUmumBulim,
      materialUmumBulim,
      zpUmumBulim,
      serviceUmumBulim,
      paymentUmumBulim,
      zagatovka,
      material,
      zp,
      service,
      payment,
      zagatovkaUmumProduct,
      materialUmumProduct,
      zpUmumProduct,
      serviceUmumProduct,
      paymentUmumProduct
    ] = await Promise.all(queries);

    const koefUmumBulim = 
      (zagatovkaByCompany && zagatovkaBySection) ? 
      zagatovkaBySection / zagatovkaByCompany * zagatovka / zagatovkaBySection 
      : 0
    
    const koefUmumProduct = 
      zagatovkaBySection ? 
      zagatovka / zagatovkaBySection 
      : 0



    // console.log(koefUmumBulim, koefUmumProduct )

    const addingZagatovka = zagatovkaUmumBulim * koefUmumBulim + zagatovkaUmumProduct * koefUmumProduct ;
    const addingMaterial = materialUmumBulim * koefUmumBulim + materialUmumProduct * koefUmumProduct ;
    const addingZp = zpUmumBulim * koefUmumBulim + zpUmumProduct * koefUmumProduct ;
    const addingService = serviceUmumBulim * koefUmumBulim + serviceUmumProduct * koefUmumProduct ;
    const addingPayment = paymentUmumBulim * koefUmumBulim + paymentUmumProduct * koefUmumProduct ;

    const charges = 
      zagatovka + addingZagatovka + 
      material + addingMaterial + 
      zp + addingZp +
      service + addingService +
      payment + addingPayment
    
    const earning = saleWithMove - charges;
    

  return (
    {
      title: productTitle,
      sectionId,
      productId,
      comeProductDocsBySection,
      comeProductDocsByProduct,
      productionCount,
      saleCountWithOutMove,
      countDeleviry,
      saleWithMove,
      zagatovka, 
      addingZagatovka,
      material, 
      addingMaterial, 
      zp, 
      addingZp, 
      service, 
      addingService,
      payment, 
      addingPayment,
      charges,
      earning
    }
      
  )
} 