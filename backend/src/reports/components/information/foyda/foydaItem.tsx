import { Schet, TypeQuery } from 'src/interfaces/report.interface';
import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { DocumentType } from 'src/interfaces/document.interface';
import { Sequelize } from 'sequelize-typescript';
import { Reference } from 'src/references/reference.model';
import { Document } from 'src/documents/document.model';
import { queryKor } from 'src/reports/querys/queryKor';
import { query } from 'src/reports/querys/query';
import { StocksService } from 'src/stocks/stocks.service';

const isDelivery = (deliverys:Reference[], id:number) => {
  if (deliverys && deliverys.length) {
    let length = deliverys.filter((item:Reference)=> item.id == id).length
    if (length) return true
  }
  return false
}

export const foydaItem = async ( 
  data: any,
  startDate: number | null,
  endDate: number | null,
  currentSectionId: number, 
  title: string,
  firstPrice: number | null,
  secondPrice: number | null,
  sequelize: Sequelize,
  deliverys: Reference[],
  zpUmumBulim: number,
  longeChargeUmumBulim: number, 
  currentPaymentUmumBulim: number,
  stockService: StocksService
) => {

  let longeCharge:number = 0;
  let filteredData:Reference[] = []

  if (data && data.length) {
    filteredData = data.filter((item: Reference)=> {
                        return item.typeReference == TypeReference.CHARGES && 
                        item.refValues.longCharge
  })}

  for (const item of filteredData) {
    longeCharge += await queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, currentSectionId, item.id, null, sequelize)
  }
    
  let productionDocsCountAll = 0;
  let productionDocsCountBux = 0;
  let productionAllDocsCountByCompany = 0;
  let countOutToDeliveryAll = 0;
  let countOutToDeliveryBux = 0;
  let countIncomeFromDeliveryAll = 0; 
  let countIncomeFromDeliveryBux = 0;
  // Shu erni uzgartirish kerak 
  let idForBuxanka = -1

  if (startDate != null && endDate != null) {
    productionAllDocsCountByCompany = 0;
    // docs.filter((item: Document) => {
    //   return (item.date>= startDate && item.date <= endDate && item.documentType == DocumentType.ComeProduct)
    // }).length

    productionDocsCountAll = 0 
    // docs.filter((item: Document) => {
    //   return (
    //       item.date>= startDate && item.date <= endDate && item.docValues.senderId == currentSectionId 
    //       && item.documentType == DocumentType.ComeProduct
    //     )
    // }).length

    productionDocsCountBux = 0
    // docs.filter((item: Document) => {
    //   return (
    //       item.date>= startDate && 
    //       item.date <= endDate &&
    //       item.docValues.analiticId == idForBuxanka && 
    //       item.docValues.senderId == currentSectionId &&
    //       item.documentType == DocumentType.ComeProduct
    //     )
    // }).length
    
    countOutToDeliveryAll = 0
    // docs.filter((item:Document) => {
    //   return (
    //     item.date>= startDate && 
    //     item.date <= endDate && 
    //     item.documentType == DocumentType.MoveProd &&
    //     item.docValues.senderId == currentSectionId  &&
    //     isDelivery(deliverys, item.docValues.receiverId )
    // )}
    // ).reduce((total, item:Document) => total + item.docValues.count, 0)

    countOutToDeliveryBux = 0
    // docs.filter((item:Document) => {
    //   return (
    //     item.date >= startDate && 
    //     item.date <= endDate && 
    //     item.documentType == DocumentType.MoveProd &&
    //     item.docValues.senderId == currentSectionId  &&
    //     item.docValues.analiticId == idForBuxanka &&
    //     isDelivery(deliverys, item.docValues.receiverId) )
    // }).reduce((total, item:Document) => total + item.docValues.count, 0)

    countIncomeFromDeliveryAll = 0
    // docs.filter((item:Document) => {
    //   return (
    //     item.date>= startDate && 
    //     item.date <= endDate && 
    //     item.documentType == DocumentType.MoveProd &&
    //     item.docValues.receiverId == currentSectionId  &&
    //     isDelivery(deliverys, item.docValues.senderId) )
    // }).reduce((total, item:Document) => total + item.docValues.count, 0)

    countIncomeFromDeliveryBux = 0
    // docs.filter((item:Document) => {
    //   return (
    //     item.date>= startDate && 
    //     item.date <= endDate && 
    //     item.documentType == DocumentType.MoveProd &&
    //     item.docValues.receiverId == currentSectionId  &&
    //     item.docValues.analiticId == idForBuxanka &&
    //     isDelivery(deliverys, item.docValues.senderId) )
    // }).reduce((total, item:Document) => total + item.docValues.count, 0)

  }

  const POKOLAll = await query(Schet.S28, TypeQuery.POKOL, startDate, endDate, currentSectionId, null, null, sequelize, stockService)
  const KOKOLAll = await query(Schet.S28, TypeQuery.KOKOL, startDate, endDate, currentSectionId, null, null, sequelize, stockService)
  
  const POKOLBux = await query(Schet.S28, TypeQuery.POKOL, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize, stockService)
  const KOKOLBux = await query(Schet.S28, TypeQuery.KOKOL, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize, stockService)

  const startCountAll = POKOLAll;
  const endCountAll = KOKOLAll;

  const startCountBux = POKOLBux;
  const endCountBux = KOKOLBux;

  const productionCountAll = await queryKor(Schet.S28, Schet.S20, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, sequelize);
  const productionCountBux = await queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const brakCountAll = await queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, sequelize);
  const brakCountBux = await queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const productionImportSumm = await queryKor(Schet.S28, Schet.S60, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);
  
  const moveOutCountAll = await queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, null, null, sequelize);
  const moveOutCountBux = await queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);
  
  const moveIncomeCountAll = await queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, currentSectionId, null, null, sequelize);
  const moveIncomeCountBux = await queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);

  const saleAll = await queryKor(Schet.S40, Schet.S28, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const saleBux = await queryKor(Schet.S40, Schet.S28, TypeQuery.OKS, startDate, endDate, currentSectionId, idForBuxanka, null, sequelize);

  const countDeleviryAll = (countOutToDeliveryAll-countIncomeFromDeliveryAll) <= 0 ? 0 : (countOutToDeliveryAll-countIncomeFromDeliveryAll)   
  const countDeleviryBux = (countOutToDeliveryBux-countIncomeFromDeliveryBux) <= 0 ? 0 : (countOutToDeliveryBux-countIncomeFromDeliveryBux)   
  
  const saleCountWithOutMoveAll = startCountAll + productionCountAll - brakCountAll - moveOutCountAll + moveIncomeCountAll - endCountAll;
  const saleCountWithOutMoveBux = startCountBux + productionCountBux - brakCountBux - moveOutCountBux + moveIncomeCountBux - endCountBux;
  
  let dAll = countDeleviryAll > 0 ? countDeleviryAll : 0
  let iAll = (moveIncomeCountAll-countIncomeFromDeliveryAll) > 0 ? (moveIncomeCountAll-countIncomeFromDeliveryAll) : 0
  let oAll = (moveOutCountAll - countOutToDeliveryAll ) > 0 ? (moveOutCountAll - countOutToDeliveryAll ) : 0
  
  let dBux = countDeleviryBux > 0 ? countDeleviryBux : 0
  let iBux = (moveIncomeCountBux-countIncomeFromDeliveryBux) > 0 ? (moveIncomeCountBux-countIncomeFromDeliveryBux) : 0
  let oBux = (moveOutCountBux - countOutToDeliveryBux ) > 0 ? (moveOutCountBux - countOutToDeliveryBux ) : 0
  
  let d = (dAll - dBux) > 0 ? (dAll - dBux) : 0
  let i = (iAll - iBux) > 0 ? (iAll - iBux) : 0
  let o = (oAll - oBux) > 0 ? (oAll - oBux) : 0
  let sale = (saleAll - saleBux) > 0 ? (saleAll - saleBux) : 0

  let valueForSale = firstPrice ? firstPrice : 0
  let valueForSaleBux = secondPrice ? secondPrice : 0
  const saleWithMove = sale + (d - i + o) * valueForSale;
  const saleWithMoveBux = saleBux + (dBux - iBux + oBux) * valueForSaleBux;
  const saleWithMoveAll = saleWithMove + saleWithMoveBux

  const zagatovka = await queryKor(Schet.S20, Schet.S21, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const materials = await queryKor(Schet.S20, Schet.S10, TypeQuery.OKS, startDate, endDate, currentSectionId, null, null, sequelize);
  const zp = await queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);

  const addingZp = productionAllDocsCountByCompany>0 ? zpUmumBulim * productionDocsCountAll / productionAllDocsCountByCompany : 0; 
  const addingLongeCharge = productionAllDocsCountByCompany>0 ? longeChargeUmumBulim * productionDocsCountAll / productionAllDocsCountByCompany : 0;
  const addingCurrentPayment = productionAllDocsCountByCompany>0 ? currentPaymentUmumBulim * productionDocsCountAll / productionAllDocsCountByCompany : 0;

  const services = await queryKor(Schet.S20, Schet.S60, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize);
  
  const currentPayment = await queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, currentSectionId, null, null, sequelize) - longeCharge;
  
  const currentCharges = zagatovka + materials + zp + addingZp + currentPayment + services + addingCurrentPayment;
  const currentEarning = saleWithMove - currentCharges;
  let koefCurrentEarningToOneProduct = 0;
  if (productionDocsCountAll>0) {
    koefCurrentEarningToOneProduct = (zagatovka  + materials) / productionDocsCountAll
  }
  
  let newItem = 0;
  
  const longPayment =  longeCharge;
  const realEarning = (saleWithMoveAll - productionImportSumm) - currentCharges - longPayment - addingLongeCharge ;
  let currentEarningForOneElement = 0;
  if (productionCountAll>0) {
    currentEarningForOneElement = 0 
  }

  return (
    {
      section: title,
      sectionId: currentSectionId,
      productionAllDocsCountByCompany,
      productionDocsCountAll,
      productionDocsCountBux,
      productionCountAll,
      productionCountBux,
      saleCountWithOutMoveAll,
      saleCountWithOutMoveBux,
      countDeleviryAll,
      countDeleviryBux,
      saleWithMoveAll,
      saleWithMoveBux,
      zagatovka,
      materials,
      zp,
      addingZp,
      services,
      addingCurrentPayment,
      currentPayment,
      currentEarning:currentEarningForOneElement,
      koefCurrentEarningToOneProduct,
      addingLongeCharge,
      longPayment,
      realEarning
    }
      
  )
} 