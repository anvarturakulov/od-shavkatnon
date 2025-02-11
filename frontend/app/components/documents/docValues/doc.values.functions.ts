import { Maindata } from '@/app/context/app.context.interfaces'
import { DocTableItem, DocumentModel, DocumentType, OptionsForDocument } from '@/app/interfaces/document.interface'
import { User, UserRoles } from '@/app/interfaces/general.interface'
import { TypeReference } from '@/app/interfaces/reference.interface'

export const getLabelForAnalitic = (currentDocument: DocumentModel, options: OptionsForDocument): string => {
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
  if (role && (role == UserRoles.TANDIR || contentName == DocumentType.ComeHalfstuff)) {
    return storageIdFromUser
  }
  
  if (role && role == UserRoles.GLBUX && contentName == DocumentType.ZpCalculate) return ''
  
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
  

  if (
      role && 
      role == UserRoles.HAMIRCHI && 
      contentName == DocumentType.LeaveHalfstuff
  ) return "659d1ff7523a48fdeb6ada6d"
  

  if (contentName == DocumentType.ComeMaterial) return storageIdFromUser

  return ''
}

export const getDefinedItemIdForSender = (role: UserRoles | undefined, storageIdFromUser: string | undefined, contentName: string) => {

  if (
    role && 
    (role == UserRoles.GLBUX || role == UserRoles.ZAMGLBUX) && (
      contentName == DocumentType.LeaveMaterial ||
      contentName == DocumentType.LeaveHalfstuff
    )) return ''
  

  if (
    storageIdFromUser &&
    role &&
    role !== UserRoles.ADMIN &&
    role !== UserRoles.HEADCOMPANY &&
    contentName != DocumentType.ComeCashFromPartners &&
    contentName != DocumentType.ComeMaterial && 
    contentName != DocumentType.LeaveHalfstuff 
  ) return storageIdFromUser

  return ''
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

  let newObj = { ...mainData.currentDocument };
  newObj.tableItems?.push(newItem)

  if (setMainData) {
    setMainData('currentDocument', { ...newObj })
  }
}