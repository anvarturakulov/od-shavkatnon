import { getRandomID } from './getRandomID';
import { Maindata } from '@/app/context/app.context.interfaces';
import { UserRoles } from '@/app/interfaces/general.interface';
import { DocumentType } from '@/app/interfaces/document.interface';
import { defaultDocument } from '@/app/context/app.context.constants';
import { getDefinedItemIdForReceiver, getDefinedItemIdForSender } from '@/app/components/documents/document/docValues/doc.values.functions';

export const setNewDocumentParams = ( setMainData: Function | undefined, mainData: Maindata ) => {
  const { user } = mainData.users;
  const { contentName } = mainData.window;
  let defValue = { ...defaultDocument }
  let num = getRandomID()
  let dateDoc = new Date();
  let dateStr = dateDoc.toISOString().split('T')[0]
  defValue.date = Date.parse(dateStr)
  defValue.documentType = contentName
  let definedItemIdForReceiver = getDefinedItemIdForReceiver(user?.role, user?.storageId, contentName)
  let definedItemIdForSender = getDefinedItemIdForSender(user?.role, user?.storageId, contentName)
  defValue.docValue.receiverId = definedItemIdForReceiver ? definedItemIdForReceiver : 0
  defValue.docValue.senderId = definedItemIdForSender ? definedItemIdForSender : 0

  if (contentName == DocumentType.SaleProd && user?.role == UserRoles.DELIVERY) {
    defValue.docValue.price = 3500;
  }

  setMainData && setMainData('currentDocument', { ...defValue });
}