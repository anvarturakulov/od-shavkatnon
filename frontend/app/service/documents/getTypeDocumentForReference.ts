import { DocumentType, DocumentTypeForReference } from "../../interfaces/document.interface";

export const getTypeDocumentForReference = (contentName: string) : DocumentTypeForReference => {
  const documentsForMaterialWithOutLeave = [
    `${DocumentType.ComeMaterial}`,
    `${DocumentType.MoveMaterial}`,
    `${DocumentType.SaleMaterial}`,
  ]
  
  const documentsForProd = [
    `${DocumentType.ComeProduct}`,
    `${DocumentType.SaleProd}`,
    `${DocumentType.LeaveProd}`,
    `${DocumentType.MoveProd}`,
    `${DocumentType.ComeCashFromPartners}`,
  ]
  
  const documentsForHalfstuff = [
    `${DocumentType.LeaveMaterial}`,
    `${DocumentType.ComeHalfstuff}`,
    `${DocumentType.LeaveHalfstuff}`,
    `${DocumentType.MoveHalfstuff}`,
    `${DocumentType.SaleHalfStuff}`,
  ]

  if (documentsForMaterialWithOutLeave.includes(contentName)) {
    return 'MATERIAL'
  }

  if (documentsForProd.includes(contentName)) {
    return 'PRODUCT'
  }

  if (documentsForHalfstuff.includes(contentName)) {
    return 'HALFSTUFF'
  }

  return 'PRODUCT'
}