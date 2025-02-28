import { Maindata } from '@/app/context/app.context.interfaces';
import { DocumentType } from '@/app/interfaces/document.interface';
import { defaultDocument } from '@/app/context/app.context.constants';
import { getDefinedItemIdForReceiver, getDefinedItemIdForSender } from '@/app/components/documents/document/docValues/doc.values.functions';
import { UserRoles } from '@/app/interfaces/user.interface';

export const setNewDocumentParams = ( setMainData: Function | undefined, mainData: Maindata ) => {
  const { user } = mainData.users;
  const { contentName } = mainData.window;
  let defValue = { ...defaultDocument }
  let dateDoc = new Date();
  let dateStr = dateDoc.toISOString().split('T')[0]
  defValue.date = Date.parse(dateStr)
  defValue.documentType = contentName
  let definedItemIdForReceiver = getDefinedItemIdForReceiver(user?.role, user?.sectionId, contentName)
  let definedItemIdForSender = getDefinedItemIdForSender(user?.role, user?.sectionId, contentName)
  defValue.docValues.receiverId = definedItemIdForReceiver ? definedItemIdForReceiver : 0
  defValue.docValues.senderId = definedItemIdForSender ? definedItemIdForSender : 0

  if (contentName == DocumentType.SaleProd && user?.role == UserRoles.DELIVERY) {
    defValue.docValues.price = 3500;
  }

  setMainData && setMainData('currentDocument', { ...defValue });
}