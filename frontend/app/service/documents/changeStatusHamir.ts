import { Maindata } from '@/app/context/app.context.interfaces';
import { HamirModel } from '@/app/interfaces/hamir.interface';
import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { defaultDocumentTableItem } from '@/app/context/app.context.constants';


export const changeStatusHamir = (item: HamirModel, mainData: Maindata, setMainData: Function | undefined) => {
  const { user } = mainData.users
  const { firstWorker, secondWorker, thirdWorker} = mainData.document.definedTandirWorkers

  let defaultDocForProduct: DocumentModel = {
    date: item.date,
    documentType: DocumentType.ComeProduct,
    userId: user?.id ? user?.id : 0,
    docStatus: DocSTATUS.PROVEDEN,
    docValues: {
      senderId: item.sectionId,
      receiverId: item.sectionId,
      analiticId: item.analiticId,
      count: item.zuvala ? item.zuvala : 0,
      price: 0,
      balance: 0,
      total: 0,
      comment: item.order + ' - хамир',
      firstWorkerId: item.firstWorker,
      secondWorkerId: item.secondWorker,
      thirdWorkerId: item.thirdWorker,
    },
    docTableItems: [defaultDocumentTableItem]
  }

  let newDoc = {...defaultDocForProduct} 

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  const actions = (mes: string) => {
    if (setMainData) {
      showMessage(`${mes}`, 'success', setMainData)
      setMainData('updateHamirJournal', true);
      setMainData('updateHamirJournal', false);
    }
  }

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/hamir/'+item.id;

  axios.patch(uriPost, newDoc, config)
    .then(function (request) {
      actions('')
    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });
  
}