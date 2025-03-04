import { DocumentType } from "src/interfaces/document.interface";

export const hasTablePartInDocument = (documentType: string): Boolean => {
  
  const documentsWithTableItems = [
    `${DocumentType.ComeHalfstuff}`,
    `${DocumentType.LeaveMaterial}`,
  ]

  if (documentsWithTableItems.includes(documentType)) {
    return true
  }

  return false

}