import { Maindata } from '@/app/context/app.context.interfaces';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { ReferenceModel, TypeSECTION } from '@/app/interfaces/reference.interface';
import { UserRoles } from '@/app/interfaces/user.interface';
import { getDocumentById } from '@/app/service/documents/getDocumentById';
import { markToDeleteDocument } from '@/app/service/documents/markToDeleteDocument';
import { setProvodkaToDocument } from '@/app/service/documents/setProvodkaToDocument';
import { markToDeleteReference } from '@/app/service/references/markToDeleteReference';
import { dateToStr } from '@/app/service/reports/dateToStr';

const deleteItem = (id: number | undefined, name: string, token: string | undefined, setMainData: Function | undefined) => {
  markToDeleteReference(id, name, setMainData, token)
}

export const getDocument = async (
  id: number | undefined,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  if (id) {
    const reference = await getDocumentById(id, setMainData, token, true);
  }
}

export const getNameReference = (references: any, id: number | undefined | null): string => {
  if (references && references.length > 0) {
    return references.filter((item: ReferenceModel) => item.id == id)[0]?.name
  }
  return 'Аникланмади'
}

export const getUserName = (id: number, mainData: Maindata): string => {
  const { usersName } = mainData.users
  if (usersName && usersName.length > 0) {
    return usersName.filter((item) => item?.id == id)[0]?.name
  }
  
  return 'Аникланмади'
}

export const deleteItemDocument = (id: number | undefined, docDate: number| undefined, token: string | undefined, setMainData: Function | undefined, mainData: Maindata) => {
  const { user } = mainData.users
  const { contentName } = mainData.window

  if (docDate == undefined) docDate = 0
  const oneDay = (24 * 60 * 60 * 1000)
  const now = Date.now()
  const remainTime = now % oneDay
  const oneDayAgo = ( now - remainTime ) - oneDay - 1
  
  if (
    user?.role == UserRoles.ADMIN || 
    user?.role == UserRoles.HEADCOMPANY || 
    ( 
      user?.role == UserRoles.ZP && 
      contentName == DocumentType.ZpCalculate &&
      dateToStr(Date.now()) == dateToStr(docDate) 
    )
  ) {
    markToDeleteDocument(id, setMainData, token)
  } else {
    alert('Узр. Факат админлар учириш хукукига эга')
  }
}

export const setProvodkaToDoc = (id: number | undefined, token: string | undefined, docStatus: DocSTATUS, setMainData: Function | undefined, mainData: Maindata, receiverId: number | undefined) => {
  if (docStatus == DocSTATUS.OPEN) {
    let yes = confirm('Хужжатга провдка берамизми')
    const { user } = mainData.users
    const { contentName } = mainData.window

    if (
        yes && 
        ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) || 
        ( user?.sectionId == receiverId)
    ){
      setProvodkaToDocument(id, setMainData, mainData)
    } else {
      alert('Узр. Сиз ушбу хужжатга проводка бера олмайсиз')
    }
  } else {
    alert('Аввал, хужжат холатини узгартиринг')
  }
}

export const getTotalValueForDocument = (document: DocumentModel): number => {
  return document.docValues.total;
}

export const isFounder = (references: any, id: number | undefined | null): boolean => {
  if (references && references.length > 0) {
    let item =  references.filter((item: ReferenceModel) => item.id == id)[0]
    return item?.refValues.typeSection == TypeSECTION.FOUNDER
  }
  return false
}

export const isDirector = (references: any, id: number | undefined | null): boolean => {
  if (references && references.length > 0) {
    let item = references.filter((item: ReferenceModel) => item.id == id)[0]
    return item?.refValues.typeSection == TypeSECTION.DIRECTOR
  }
  return false
}