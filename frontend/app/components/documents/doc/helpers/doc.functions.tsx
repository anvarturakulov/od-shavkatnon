import { defaultDocumentFormItems, defaultDocumentTableItem } from '@/app/context/app.context.constants';
import { Maindata } from '@/app/context/app.context.interfaces';
import { DocTableItem, DocumentModel } from '@/app/interfaces/document.interface';
import { showMessage } from '@/app/service/common/showMessage';
import { getRandomID } from '@/app/service/documents/getRandomID';
import { updateCreateDocument } from '@/app/service/documents/updateCreateDocument';
import { validateBody } from '@/app/service/documents/validateBody';

export const addItems = (setMainData: Function | undefined, newItem: DocTableItem, items: Array<DocTableItem>) => {
  let newItems = [...items, newItem];
  if (setMainData) {
      setMainData('docTable', {items: newItems})
  }
}

export const saveNumber = (setNumberDoc: Function, setMainData: Function | undefined, mainData: Maindata) => {
  let num = getRandomID()
  setNumberDoc(num);
  
  let {currentDocument} = mainData;
  let newObj = {
      ...currentDocument,
      docNumber: num,
  }

  if ( setMainData ) {
      setMainData('currentDocument', {...newObj})
  }
}

export const cancelSubmit = (setMainData: Function | undefined) => {
    if (setMainData) {
        setMainData('clearControlElements', true);
        setMainData('showDocumentWindow', false);
        setMainData('isNewDocument', false);
        let defaultTableItemsObj = {items: [defaultDocumentTableItem]}
        setMainData('docTable', {...defaultTableItemsObj});
        setMainData('currentDocument', {...defaultDocumentFormItems});
    }
}

export const onSubmit = ( mainData: Maindata, setMainData: Function| undefined ) => {
    const {user, currentDocument, isNewDocument, docTable} = mainData;
    
    let body: DocumentModel = {
        ...currentDocument,
        tableItems: [...docTable.items]
    }
    
    console.log('Array');
    console.log(body)
        
    if (!validateBody(body)) {
        showMessage('Хужжатни тулдиришда хатолик бор. Шу ердан кайтаяпти*', 'error', setMainData);
    } else {
        updateCreateDocument(mainData, setMainData);
    }
    
}

export const secondsToDateString = (seconds: number): String => {
    return new Date(seconds).toISOString().split('T')[0]
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