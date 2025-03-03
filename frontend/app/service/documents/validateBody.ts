import { DocumentModel, DocumentType } from "../../interfaces/document.interface";

export const validateBody = (body: DocumentModel): Boolean => {

  const { date, id, documentType, docTableItems } = body
  const { analiticId, senderId, receiverId, total, count } = body.docValues

  if (!date || !id || !documentType) return false

  const documentsWithAnalitic = [
    `${DocumentType.ComeMaterial}`,
    `${DocumentType.ComeProduct}`,
    `${DocumentType.LeaveProd}`,
    `${DocumentType.LeaveHalfstuff}`,
    `${DocumentType.MoveProd}`,
    `${DocumentType.MoveMaterial}`,
    `${DocumentType.MoveHalfstuff}`,
    `${DocumentType.SaleProd}`,
    `${DocumentType.SaleMaterial}`
  ]

  if (documentsWithAnalitic.includes(documentType)) {
    if (!analiticId || !senderId || !receiverId || !count) {
      return false
    }
  }

  const documentsWithTableItems = [
    `${DocumentType.LeaveMaterial}`,
    `${DocumentType.ComeHalfstuff}`,
  ]

  if (documentsWithTableItems.includes(documentType)) {
    let balanceNotEmpty = true
    let countNotEmpty = true
    let priceNotEmpty = true
    let totalNotEmpty = true
    let countOverBalance = true
    
    docTableItems.forEach(item => {
      // if (item.balance <= 0) balanceNotEmpty = false
      if (item.count <= 0) countNotEmpty = false
      if (item.price <= 0) priceNotEmpty = false
      if (item.total <= 0) totalNotEmpty = false
      // if (item.count > item.balance) countOverBalance = false
    })

    if (
        !balanceNotEmpty || !countNotEmpty || 
        !priceNotEmpty || !totalNotEmpty || 
        !docTableItems.length || !countOverBalance
      ) {
      return false
    }
  }

  const documentsLeaveMaterial = [
    `${DocumentType.LeaveMaterial}`,
  ]

  if (documentsLeaveMaterial.includes(documentType)) {
    if (!senderId || !receiverId ) {
      return false
    }
  }

  const documentsComeHalfstuff = [
    `${DocumentType.ComeHalfstuff}`,
  ]

  if (documentsComeHalfstuff.includes(documentType)) {
    if (!analiticId || !senderId || !receiverId || !count) {
      return false
    }
  }

  const documentsToTotal = [
    `${DocumentType.ComeMaterial}`,
    `${DocumentType.MoveMaterial}`,
    `${DocumentType.SaleProd}`,
  ]

  if (documentsToTotal.includes(documentType)) {
    if (!total) {
      return false
    }
  }

  const documentsForCashFromPartners = [
    `${DocumentType.ComeCashFromPartners}`,
    `${DocumentType.MoveCash}`,
  ]

  if (documentsForCashFromPartners.includes(documentType)) {
    if (receiverId && senderId && total) return true
    else return false
  }

  const documentsForCashLeave = [
    `${DocumentType.LeaveCash}`,
  ]

  if (documentsForCashLeave.includes(documentType)) {
    if (!senderId || !analiticId || !total) return false
  }

  const documentsForZpCalculate = [
    `${DocumentType.ZpCalculate}`,
  ]

  if (documentsForZpCalculate.includes(documentType)) {
    if (!receiverId || !analiticId || !total) return false
  }

  const documentsWithBalance = [
    `${DocumentType.LeaveProd}`,
    `${DocumentType.MoveProd}`,
    `${DocumentType.LeaveHalfstuff}`,
    `${DocumentType.MoveHalfstuff}`,
    `${DocumentType.LeaveMaterial}`,
    `${DocumentType.MoveMaterial}`,
  ]

  return true

}