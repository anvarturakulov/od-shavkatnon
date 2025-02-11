import { DocumentType, OptionsForDocument } from "../../interfaces/document.interface";

export const hasDocumentTablePart = (documentType: string): Boolean => {
  
  const documentsWithTableItems = [
    `${DocumentType.ComeMaterial}`,
    `${DocumentType.ComeProduct}`,
    `${DocumentType.ComeHalfstuff}`,
    `${DocumentType.SaleProd}`,
    `${DocumentType.SaleMaterial}`,
    `${DocumentType.LeaveProd}`,
    `${DocumentType.LeaveMaterial}`,
    `${DocumentType.LeaveHalfstuff}`,
    `${DocumentType.MoveProd}`,
    `${DocumentType.MoveMaterial}`,
    `${DocumentType.MoveHalfstuff}`,
    `${DocumentType.LeaveCash}`,
  ]

  if (documentsWithTableItems.includes(documentType)) {
    return true
  }

  const documentsWithOutTableItems = [
    `${DocumentType.ComeCashFromPartners}`,
    `${DocumentType.MoveCash}`,
  ]

  if (documentsWithOutTableItems.includes(documentType)) {
    return false
  }

  return false



  // const documentsForZp = [
  //   `${DocumentType.ZpCalculate}`,
  // ]

  // if (documentsForZp.includes(documentType)) {
  //   senderType = TypeReference.STORAGES
  //   senderLabel = '-----'
  //   receiverType = TypeReference.STORAGES
  //   receiverLabel = 'Булим'
  //   paymentLabel = '------'
  //   paymentIsVisible = false
  //   tableIsVisible = true
  //   senderIsVisible = false
  //   recieverIsVisible = true
  // }

  return true

}