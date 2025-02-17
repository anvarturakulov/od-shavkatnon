import { defaultDocumentFormItems } from '@/app/context/app.context.constants';
import { Maindata } from '@/app/context/app.context.interfaces';
import { DocumentType } from '@/app/interfaces/document.interface';
import { UserRoles } from '@/app/interfaces/general.interface';

export const saveUser = (setMainData: Function | undefined, mainData: Maindata): any => {
  let {currentDocument} = mainData;
  let newObj = {
      ...currentDocument,
      user: mainData.user?.name,
      documentType: mainData.contentName
  }

  if ( setMainData ) {
      setMainData('currentDocument', {...newObj})
  }
}

export const saveProvodka = (setMainData: Function | undefined, mainData: Maindata) => {
  let { currentDocument ,isNewDocument, contentName } = mainData;
  let value = true
  
  if (contentName == DocumentType.LeaveCash || contentName == DocumentType.MoveCash) {
    value = false
  }

  let newObj = {
      ...currentDocument,
      proveden: value,
  }

  if ( setMainData ) {
      setMainData('currentDocument', {...newObj})
  }
}

export const cancelSubmit = (setMainData: Function | undefined, mainData: Maindata) => {
    if (setMainData) {
        setMainData('clearControlElements', true);
        setMainData('showDocumentWindow', false);
        setMainData('isNewDocument', false);
        setMainData('currentDocument', {...defaultDocumentFormItems});
        if (mainData.user?.role != UserRoles.HEADCOMPANY && mainData.user?.role != UserRoles.ADMIN) setMainData('mainPage', true)
    }
}

export const secondsToDateString = (seconds: number): String => {
    return new Date(seconds).toLocaleDateString('ru-RU')
}

export const saveDocumentType = (setMainData: Function | undefined, mainData: Maindata) => {
  
  let {currentDocument, contentName} = mainData;
  let newObj = {
      ...currentDocument,
      documentType: contentName,
  }

  if ( setMainData ) {
      setMainData('currentDocument', {...newObj})
  }
}

