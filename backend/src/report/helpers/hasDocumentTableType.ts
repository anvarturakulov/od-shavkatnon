import { DocumentType } from "../../interfaces/document.interface";

export const hasDocumentTablePart = (documentType: string): Boolean => {
  
  const documentsWithTableItems = [
    `${DocumentType.ComeHalfstuff}`,
    `${DocumentType.LeaveMaterial}`,
  ]

  if (documentsWithTableItems.includes(documentType)) {
    return true
  }

  return false

}