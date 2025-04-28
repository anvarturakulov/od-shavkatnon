import { Maindata } from '@/app/context/app.context.interfaces';
import { showMessage } from '../common/showMessage';
import axios from 'axios';
import {  DocumentType } from '@/app/interfaces/document.interface';
import { defaultDatesForDuplicateDocs } from '@/app/context/app.context.constants';

export const duplicateDocsForDate = (dateFrom: number, dateTo: number, mainData: Maindata, setMainData: Function | undefined) => {
  
  const { user } = mainData.users
  
  if (!user?.id) return
  
  let body = {
    dateFrom: dateFrom, 
    dateTo: dateTo,
    documentType: DocumentType.ZpCalculate,
    userId: user.id
  }

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  const actions = (mes: string) => {
    if (setMainData) {
      showMessage(`${mes}`, 'success', setMainData)
      setMainData('goRequestByDuplicateDocs', false);
      setMainData('updateDataForDocumentJournal', false);
      setMainData('datesForDuplicateDocs', {...defaultDatesForDuplicateDocs})
    }
  }

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/duplicateDocsByTypeForDate';

  axios.post(uriPost, body, config)
    .then(function (request) {
      actions('Янги хужжатлар тузилди')
      
    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });
  
}