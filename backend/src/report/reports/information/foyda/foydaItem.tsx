import { EntryItem, FoydaPrice, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { queryKor } from 'src/report/helpers/querys/queryKor';
import { query } from 'src/report/helpers/querys/query';
import { ReferenceModel, TypeReference } from 'src/interfaces/reference.interface';
import { Document } from 'src/document/models/document.model';
import { DocumentType } from 'src/interfaces/document.interface';
import { ReferenceDocument } from 'src/reference/models/referense.model';

const isDelivery = (deliverys:ReferenceDocument[],id:string) => {
  if (deliverys && deliverys.length) {
    let length = deliverys.filter((item:ReferenceDocument)=> String(item._id) == id).length
    if (length) return true
  }
  return false
}

export const foydaItem = ( 
  data: any,
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string,
  foydaPrice: FoydaPrice,
  globalEntrys: Array<EntryItem> | undefined,
  docs: Document[],
  deliverys: ReferenceDocument[],
  zpUmumBulim: number,
  longeChargeUmumBulim: number, 
  currentPaymentUmumBulim: number ) => {

    let longeCharge:number = 0;
    
    data && data.length &&
    data
    .filter((item: ReferenceModel)=> {
      return item.typeReference == TypeReference.CHARGES && item.longCharge
    })
    .forEach((item: ReferenceModel) => {
      // console.log(item.name)
      longeCharge += queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, String(currentSectionId), String(item._id), globalEntrys)
    })
    
    
    let productionDocsCountAll = 0;
    let productionDocsCountBux = 0;
    let productionAllDocsCountByCompany = 0;
    let countOutToDeliveryAll = 0;
    let countOutToDeliveryBux = 0;
    let countIncomeFromDeliveryAll = 0; 
    let countIncomeFromDeliveryBux = 0; 
    let idForBuxanka = '678dc6a8d32db54479bf5d79'

  if (docs && docs.length > 0) {
    
    productionAllDocsCountByCompany = docs.filter((item: Document) => {
      return (item.date>= startDate && item.date <= endDate && item.documentType == DocumentType.ComeProduct)
    }).length

    productionDocsCountAll = docs.filter((item: Document) => {
      return (item.date>= startDate && item.date <= endDate && String(item.senderId) == currentSectionId && item.documentType == DocumentType.ComeProduct)
    }).length

    productionDocsCountBux = docs.filter((item: Document) => {
      return (
          item.date>= startDate && 
          item.date <= endDate &&
          String(item.analiticId) == idForBuxanka && 
          String(item.senderId) == currentSectionId &&
          item.documentType == DocumentType.ComeProduct)
    }).length
    
    countOutToDeliveryAll = docs.filter((item:Document) => {
      return (
        item.date>= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.MoveProd &&
        String(item.senderId) == String(currentSectionId)  &&
        isDelivery(deliverys, String(item.receiverId)) )
    }).reduce((total, item:Document) => total + item.count, 0)

    countOutToDeliveryBux = docs.filter((item:Document) => {
      return (
        item.date >= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.MoveProd &&
        String(item.senderId) == String(currentSectionId)  &&
        String(item.analiticId) == String(idForBuxanka) &&
        isDelivery(deliverys, String(item.receiverId)) )
    }).reduce((total, item:Document) => total + item.count, 0)

    countIncomeFromDeliveryAll = docs.filter((item:Document) => {
      return (
        item.date>= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.MoveProd &&
        String(item.receiverId) == String(currentSectionId)  &&
        isDelivery(deliverys, String(item.senderId)) )
    }).reduce((total, item:Document) => total + item.count, 0)

    countIncomeFromDeliveryBux = docs.filter((item:Document) => {
      return (
        item.date>= startDate && 
        item.date <= endDate && 
        item.documentType == DocumentType.MoveProd &&
        String(item.receiverId) == String(currentSectionId)  &&
        String(item.analiticId) == String(idForBuxanka) &&
        isDelivery(deliverys, String(item.senderId)) )
    }).reduce((total, item:Document) => total + item.count, 0)

  }

  const PDKOLAll = query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, '', globalEntrys)
  const PKKOLAll = query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, '', globalEntrys)
  const TDKOLAll = query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, '', globalEntrys)
  const TKKOLAll = query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, '', globalEntrys)

  const PDKOLBux = query(Schet.S28, TypeQuery.PDKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys)
  const PKKOLBux = query(Schet.S28, TypeQuery.PKKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys)
  const TDKOLBux = query(Schet.S28, TypeQuery.TDKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys)
  const TKKOLBux = query(Schet.S28, TypeQuery.TKKOL, startDate, endDate, currentSectionId, idForBuxanka, globalEntrys)
  
  const startCountAll = PDKOLAll-PKKOLAll;
  const endCountAll = startCountAll+TDKOLAll-TKKOLAll;

  const startCountBux = PDKOLBux-PKKOLBux;
  const endCountBux = startCountBux+TDKOLBux-TKKOLBux;

  const productionCountAll = queryKor(Schet.S28, Schet.S20, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const productionCountBux = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
  
  const brakCountAll = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const brakCountBux = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
  
  const productionImportSumm = queryKor(Schet.S28, Schet.S60, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  
  const moveOutCountAll = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const moveOutCountBux = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);
  
  const moveIncomeCountAll = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const moveIncomeCountBux = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);

  const saleAll = queryKor(Schet.S40, Schet.S28, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const saleBux = queryKor(Schet.S40, Schet.S28, TypeQuery.OKS, startDate, endDate, String(currentSectionId), idForBuxanka, globalEntrys);

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


  let valueForSale = + foydaPrice.first
  let valueForSaleBux = + foydaPrice.second
  const saleWithMove = sale + (d - i + o) * valueForSale;
  const saleWithMoveBux = saleBux + (dBux - iBux + oBux) * valueForSaleBux;
  const saleWithMoveAll = saleWithMove + saleWithMoveBux

  const zagatovka = queryKor(Schet.S20, Schet.S21, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const materials = queryKor(Schet.S20, Schet.S10, TypeQuery.OKS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  const zp = queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys);

  const addingZp = productionAllDocsCountByCompany>0 ? zpUmumBulim * productionDocsCountAll / productionAllDocsCountByCompany : 0; 
  const addingLongeCharge = productionAllDocsCountByCompany>0 ? longeChargeUmumBulim * productionDocsCountAll / productionAllDocsCountByCompany : 0;
  const addingCurrentPayment = productionAllDocsCountByCompany>0 ? currentPaymentUmumBulim * productionDocsCountAll / productionAllDocsCountByCompany : 0;

  const services = queryKor(Schet.S20, Schet.S60, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys);
  
  const currentPayment = queryKor(Schet.S20, Schet.S50, TypeQuery.ODS, startDate, endDate, String(currentSectionId), '', globalEntrys) - longeCharge;
  
  const currentCharges = zagatovka + materials + zp + addingZp + currentPayment + services + addingCurrentPayment;
  const currentEarning = saleWithMove - currentCharges;
  let koefCurrentEarningToOneProduct = 0;
  if (productionDocsCountAll>0) {
    koefCurrentEarningToOneProduct = (zagatovka  + materials) / productionDocsCountAll
  }
  // rokklslsl
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