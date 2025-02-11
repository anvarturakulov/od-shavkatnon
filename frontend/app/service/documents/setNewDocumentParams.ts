import { defaultDocumentFormItems } from '@/app/context/app.context.constants';
import { getRandomID } from './getRandomID';
import { Maindata } from '@/app/context/app.context.interfaces';
import { UserRoles } from '@/app/interfaces/general.interface';
import { DocumentType } from '@/app/interfaces/document.interface';
import { getDefinedItemIdForReceiver, getDefinedItemIdForSender } from '@/app/components/documents/docValues/doc.values.functions';

export const setNewDocumentParams = ( setMainData: Function | undefined, mainData: Maindata ) => {
  const { user, contentName } = mainData;
  let defValue = { ...defaultDocumentFormItems }
  let num = getRandomID()
  let dateDoc = new Date();
  let dateStr = dateDoc.toISOString().split('T')[0]
  defValue.docNumber = num;
  defValue.date = Date.parse(dateStr)
  defValue.documentType = contentName
  let definedItemIdForReceiver = getDefinedItemIdForReceiver(user?.role, user?.storageId, contentName)
  let definedItemIdForSender = getDefinedItemIdForSender(user?.role, user?.storageId, contentName)
  defValue.receiverId = definedItemIdForReceiver ? definedItemIdForReceiver : ''
  defValue.senderId = definedItemIdForSender ? definedItemIdForSender : ''

  if (contentName == DocumentType.SaleProd && mainData.user?.role == UserRoles.DELIVERY) {
    defValue.price = 3500;
  }

  setMainData && setMainData('currentDocument', { ...defValue });
}