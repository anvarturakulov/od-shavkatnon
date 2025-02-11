import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { Maindata } from '@/app/context/app.context.interfaces';
import { defaultDocumentFormItems } from '@/app/context/app.context.constants';
import { DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { workersUsersList } from '@/app/interfaces/general.interface';

export const updateCreateDocument = (mainData: Maindata, setMainData: Function | undefined) => {
  const { user, currentDocument, isNewDocument, contentName } = mainData

  let body: DocumentModel = {
    ...currentDocument,
  }
  
  let docsForNoProveden: Array<string> = [DocumentType.MoveCash, DocumentType.MoveProd, DocumentType.LeaveCash]
  delete body._id;
  if (isNewDocument && docsForNoProveden.includes(contentName)) {
    body.proveden = false
  }

  const config = {
    headers: { Authorization: `Bearer ${user?.access_token}` }
  };

  const actionWithMainData = (mes: string) => {
    if (setMainData) {
      showMessage(`${mes}`, 'success', setMainData)
      setMainData('clearControlElements', true);
      setMainData('showDocumentWindow', false);
      setMainData('isNewDocument', false);
      setMainData('currentDocument', { ...defaultDocumentFormItems });
      if (user && workersUsersList.includes(user?.role)) {
        setMainData('mainPage', true);
      }
    }
  }

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/document/create';
  const uriPatch = process.env.NEXT_PUBLIC_DOMAIN + '/api/document/' + currentDocument._id;

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
    if (currentDocument._id) {
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