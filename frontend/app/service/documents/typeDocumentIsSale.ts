import { DocumentType } from "../../interfaces/document.interface";

export const typeDocumentIsSale = (documentType: string): Boolean => {

  const documentsWithTypelSale = [
    `${DocumentType.SaleProd}`,
    `${DocumentType.SaleMaterial}`,
  ]

  if (documentsWithTypelSale.includes(documentType)) {
    return true
  }

  return false

}