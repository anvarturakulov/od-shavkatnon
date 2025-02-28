import { defaultDocument } from '@/app/context/app.context.constants';
import { Maindata } from '@/app/context/app.context.interfaces';
import { DocumentType } from '@/app/interfaces/document.interface';
import { UserRoles } from '@/app/interfaces/user.interface';

export const saveUser = (setMainData: Function | undefined, mainData: Maindata): any => {
  let {currentDocument} = mainData.document;
  let newObj = {
      ...currentDocument,
      userId: mainData.users.user?.id,
      documentType: mainData.window.contentName
  }

  if ( setMainData ) {
      setMainData('currentDocument', {...newObj})
  }
}

export const saveProvodka = (setMainData: Function | undefined, mainData: Maindata) => {
  let { contentName } = mainData.window;
  let { currentDocument } = mainData.document;
  
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
    const {user} = mainData.users
    if (setMainData) {
        setMainData('clearControlElements', true);
        setMainData('showDocumentWindow', false);
        setMainData('isNewDocument', false);
        setMainData('currentDocument', {...defaultDocument});
        if (user?.role != UserRoles.HEADCOMPANY && user?.role != UserRoles.ADMIN) setMainData('mainPage', true)
    }
}

export const secondsToDateString = (seconds: number): String => {
    
    return new Date(+seconds).toLocaleString()
}

export const saveDocumentType = (setMainData: Function | undefined, mainData: Maindata) => {
  
  let { contentName } = mainData.window;
  let { currentDocument } = mainData.document;
  let newObj = {
      ...currentDocument,
      documentType: contentName,
  }

  if ( setMainData ) {
      setMainData('currentDocument', {...newObj})
  }
}

