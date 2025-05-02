import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { Maindata } from '@/app/context/app.context.interfaces';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { defaultDocument, defaultDocumentTableItem, defaultDocValue } from '@/app/context/app.context.constants';
import { workersUsersList } from '@/app/interfaces/user.interface';

export const updateCreateDocument = (mainData: Maindata, setMainData: Function | undefined) => {
  const { user } = mainData.users
  const { currentDocument } = mainData.document
  const { isNewDocument, contentName } = mainData.window

  let body: DocumentModel = {
    ...currentDocument,
  }
  
  let docsForNoProveden: Array<string> = [DocumentType.MoveCash, DocumentType.MoveProd, DocumentType.LeaveCash]
  delete body.id;
  
  if (body.docValues.analiticId == 0) {
    let newDocValues = {...body.docValues}
    delete newDocValues.analiticId
    body = {
      ...body,
      docValues: {...newDocValues}
    }
  }

  if (body.docValues.productForChargeId == 0) {
    let newDocValues = {...body.docValues}
    delete newDocValues.productForChargeId
    body = {
      ...body,
      docValues: {...newDocValues}
    }
  }

  if (body.docValues.senderId == 0) {
    let newDocValues = {...body.docValues}
    body = {
      ...body,
      docValues: {
        ...newDocValues,
        senderId: newDocValues.receiverId
      }
    }
  }


  if (isNewDocument) {
    if (docsForNoProveden.includes(contentName)) {
      body.docStatus = DocSTATUS.OPEN
    } else {
      body.docStatus = DocSTATUS.PROVEDEN
    }
  } 

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  const actionWithMainData = (mes: string) => {
    if (setMainData) {
      showMessage(`${mes}`, 'success', setMainData)
      setMainData('clearControlElements', true);
      setMainData('showDocumentWindow', false);
      setMainData('isNewDocument', false);
      const defValue:DocumentModel = {
        ...defaultDocument,
        docValues: {...defaultDocValue},
        docTableItems: [defaultDocumentTableItem]
      }
      setMainData('currentDocument', { ...defValue });
      setMainData('docValues', { ...defaultDocValue });

      if (user && workersUsersList.includes(user?.role)) {
        setMainData('mainPage', true);
      }
    }
  }

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/create';
  const uriPatch = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/update/' + currentDocument.id;
  
  if (isNewDocument && body.documentType == DocumentType.ZpCalculate && body.docValues.senderId == 0) {
    body.docValues = {
      ... body.docValues,
      senderId: body.docValues.receiverId
    }
  }
  if (isNewDocument) {
    axios.post(uriPost, body, config)
      .then(function (request) {
        actionWithMainData('янги хужжати киритилди')
      })
      .catch(function (error) {
        if (setMainData) {
          showMessage(error.message, 'error', setMainData)
        }
      });
  } else {
    if (currentDocument.id) {
      axios.patch(uriPatch, body, config)
        .then(function () {
          actionWithMainData('хужжат янгиланди')
          return true
        })
        .catch(function (error) {
          if (setMainData) {
            showMessage(error.message, 'error', setMainData)
            return false
          }
        });
    };
  }
}