import { Maindata } from '@/app/context/app.context.interfaces'
import { DocTableItem, DocumentModel, DocumentType, OptionsForDocument } from '@/app/interfaces/document.interface'
import { User, UserRoles } from '@/app/interfaces/general.interface'
import { TypeReference } from '@/app/interfaces/reference.interface'

export const getLabelForAnalitic = (currentDocument: DocumentModel, options: OptionsForDocument): string => {
  
  let {isPartner, isWorker} = currentDocument.docValue

  if (currentDocument && isPartner) {
    return 'Хамкор'
  }
  if (currentDocument && isWorker) {
    'Ходим'
  }
  return options.analiticLabel
}

export const getTypeReferenceForAnalitic = (currentDocument: DocumentModel, options: OptionsForDocument) => {
  let {isPartner, isWorker} = currentDocument.docValue

  if (currentDocument && isPartner) {
    return TypeReference.PARTNERS
  }
  if (currentDocument && isWorker) {
    return TypeReference.WORKERS
  }
  return options.analiticType
}


export const saveItemId = (storageId: number | undefined, type: 'reciever' | 'sender', mainData: Maindata, setMainData: Function | undefined,) => {
  let currentItem = { ...mainData.document.currentDocument };
  
  if (storageId && type == 'reciever') currentItem.docValue.receiverId = storageId
  if (storageId && type == 'sender') currentItem.docValue.senderId = storageId

  if (setMainData) {
    setMainData('currentDocument', { ...currentItem })
  }
}

export const getDefinedItemIdForReceiver = (role: UserRoles | undefined, storageIdFromUser: number | undefined, contentName: string) => {
  if (role && (role == UserRoles.TANDIR || contentName == DocumentType.ComeHalfstuff)) {
    return storageIdFromUser
  }
  
  if (role && role == UserRoles.GLBUX && contentName == DocumentType.ZpCalculate) return -1
  
  if (
      storageIdFromUser && 
      role && 
      role !== UserRoles.ADMIN && 
      role !== UserRoles.HEADCOMPANY &&
      role !== UserRoles.ZAMGLBUX && 
      role !== UserRoles.GLBUX && 
      ( 
        contentName == DocumentType.ComeCashFromPartners ||
        contentName == DocumentType.LeaveCash
      ) 
  ) return storageIdFromUser
  

  if (contentName == DocumentType.ComeMaterial) return storageIdFromUser

  return -1
}

export const getDefinedItemIdForSender = (role: UserRoles | undefined, storageIdFromUser: number | undefined, contentName: string) => {

  if (
    role && 
    (role == UserRoles.GLBUX || role == UserRoles.ZAMGLBUX) && (
      contentName == DocumentType.LeaveMaterial ||
      contentName == DocumentType.LeaveHalfstuff
    )) return -1
  

  if (
    storageIdFromUser &&
    role &&
    role !== UserRoles.ADMIN &&
    role !== UserRoles.HEADCOMPANY &&
    contentName != DocumentType.ComeCashFromPartners &&
    contentName != DocumentType.ComeMaterial && 
    contentName != DocumentType.LeaveHalfstuff 
  ) return storageIdFromUser

  return -1
}


export const visibilityCommentValueInDocument = (contentName: string, user: User | undefined): boolean => {
  const documents = [
    `${DocumentType.MoveCash}`,
    `${DocumentType.LeaveCash}`,
    `${DocumentType.MoveHalfstuff}`,
    `${DocumentType.LeaveHalfstuff}`,
    `${DocumentType.ComeProduct}`,
    `${DocumentType.ZpCalculate}`
  ]

  if (user) {
    if (documents.includes(contentName)) return true
  }

  return false
}

export const addItems = (setMainData: Function | undefined, mainData: Maindata, newItem: DocTableItem) => {

  let newObj = { ...mainData.document.currentDocument };
  newObj.docTableItems?.push(newItem)

  if (setMainData) {
    setMainData('currentDocument', { ...newObj })
  }
}