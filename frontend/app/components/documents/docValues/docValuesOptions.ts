import { Maindata } from '@/app/context/app.context.interfaces'
import { DocumentModel, DocumentType, OptionsForDocument } from '@/app/interfaces/document.interface'
import { User, UserRoles } from '@/app/interfaces/general.interface'
import { TypeReference } from '@/app/interfaces/reference.interface'

export const getLabelForAnalitic = (currentDocument: DocumentModel, options: OptionsForDocument):string => {
  if (currentDocument && currentDocument.isPartner) {
    return 'Хамкор'
  }
  if (currentDocument && currentDocument.isWorker) {
    'Ходим'
  }
  return options.analiticLabel
}

export const getTypeReferenceForAnalitic = (currentDocument: DocumentModel, options: OptionsForDocument) => {
  if (currentDocument && currentDocument.isPartner) {
    return TypeReference.PARTNERS
  }
  if (currentDocument && currentDocument.isWorker) {
    return TypeReference.WORKERS 
  }
  return options.analiticType
}


export const saveItemId = (storageId: string | undefined, type: 'reciever' | 'sender', mainData: Maindata, setMainData: Function | undefined,) => {
  let currentItem = { ...mainData.currentDocument };
  if (storageId && type == 'reciever') currentItem.receiverId = storageId
  if (storageId && type == 'sender') currentItem.senderId = storageId

  if (setMainData) {
    setMainData('currentDocument', { ...currentItem })
  }
}

export const getDefinedItemIdForReceiver = (role: UserRoles | undefined, storageIdFromUser: string | undefined, contentName: string) => {
  if (role && (role == UserRoles.ZUVALACHI || (role == UserRoles.ELAKCHI && contentName == DocumentType.ComeHalfstuff))) {
    return storageIdFromUser
  } 
  if (storageIdFromUser && role && role !== UserRoles.ADMIN && role !== UserRoles.HEADCOMPANY && contentName == DocumentType.ComeCashFromPartners) {
    return storageIdFromUser
  }
  if (role && role == UserRoles.HAMIRCHI) {
    return "659d1ff7523a48fdeb6ada6d" 
  }
  return ''
}

export const getDefinedItemIdForSender = (role: UserRoles | undefined, storageIdFromUser: string | undefined, contentName: string) => {
  if (
      storageIdFromUser && 
      role && 
      role !== UserRoles.ADMIN &&
      role !== UserRoles.HEADCOMPANY &&
      contentName != DocumentType.ComeCashFromPartners
    ) return storageIdFromUser
  
  return ''
}

export const visibilityPriceValueInDocument = (contentName:string, user:User | undefined): boolean => {
  const documents = [
    `${DocumentType.ComeCashFromPartners}`,
    `${DocumentType.LeaveCash}`,
    `${DocumentType.MoveCash}`,
  ]

  if (user) {
    if (documents.includes(contentName)) return false
  }

  return true
}

export const visibilityTotalValueInDocument = (contentName: string, user: User | undefined): boolean => {
  const documents = [
    `${DocumentType.ComeHalfstuff}`,
    `${DocumentType.LeaveHalfstuff}`,
    `${DocumentType.MoveHalfstuff}`,
    `${DocumentType.MoveHalfstuff}`,
    `${DocumentType.ComeCashFromPartners}`
  ]

  if (user) {
    if (user.role == UserRoles.HAMIRCHI || user.role == UserRoles.ZUVALACHI) return false
    
    if (documents.includes(contentName)) return false
  }
   

  return true
}


export const visibilityCashFromPartnerValueInDocument = (contentName: string, user: User | undefined): boolean => {
  const documents = [
    `${DocumentType.SaleProd}`,
    `${DocumentType.ComeCashFromPartners}`
  ]

  if (user) {
    if (documents.includes(contentName)) return true
  }

  return false
}