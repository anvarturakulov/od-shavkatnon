import { DocumentType, DocumentTypeForReference } from "../../interfaces/document.interface";

export const getSchetForQuery = (contentName: string) : DocumentTypeForReference => {
  const documentsForMaterialWithOutLeave = [
    `${DocumentType.ComeMaterial}`,
    `${DocumentType.MoveMaterial}`,
    `${DocumentType.SaleMaterial}`,
    `${DocumentType.LeaveMaterial}`,
    `${DocumentType.ComeHalfstuff}`,
  ]
  
  const documentsForProd = [
    `${DocumentType.ComeProduct}`,
    `${DocumentType.SaleProd}`,
    `${DocumentType.LeaveProd}`,
    `${DocumentType.MoveProd}`,
  ]
  
  const documentsForHalfstuff = [
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