import { Maindata } from '@/app/context/app.context.interfaces';
import { HamirModel } from '@/app/interfaces/hamir.interface';
import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { getRandomID } from './getRandomID';
import { UserRoles } from '@/app/interfaces/general.interface';

// in this function we change status for this hamir doc and
// create new doc LeaveHalfStuff based on this hamir doc

export const changeStatusHamir = (item: HamirModel, mainData: Maindata, setMainData: Function | undefined) => {
  const { user } = mainData
  const { firstWorker, secondWorker, thirdWorker} = mainData.definedTandirWorkers

  let defaultDocForHalfstuff: DocumentModel = {
    date: item.date,
    docNumber: getRandomID(),
    documentType: DocumentType.LeaveHalfstuff,
    deleted: false,
    user: user?.name ? user?.name: '',
    senderId: item.sectionId,
    receiverId: '659d1ff7523a48fdeb6ada6d',
    analiticId: item.analiticId,
    count: 1,
    balance: 0,
    total:0,
    proveden: true,
    comment: item.order+' - хамир',
    price: 0,
    firstWorkerId: item.firstWorker,
    tableItems: [],

  }

  let defaultDocForProduct: DocumentModel = {
    date: item.date,
    docNumber: getRandomID(),
    documentType: DocumentType.ComeProduct,
    deleted: false,
    user: user?.name ? user?.name : '',
    senderId: item.sectionId,
    receiverId: item.sectionId,
    analiticId: item.analiticId,
    count: item.zuvala ? item.zuvala : 0,
    balance: 0,
    total: 0,
    proveden: true,
    comment: item.order + ' - хамир',
    firstWorkerId: item.firstWorker,
    secondWorkerId: item.secondWorker,
    thirdWorkerId: item.thirdWorker,
    price: 0,
    tableItems: []
  }

  let newDoc = user?.role == UserRoles.HAMIRCHI ? {...defaultDocForHalfstuff} : {...defaultDocForProduct} 

  const config = {
    headers: { Authorization: `Bearer ${user?.access_token}` }
  };

  const actions = (mes: string) => {
    if (setMainData) {
      showMessage(`${mes}`, 'success', setMainData)
      setMainData('updateHamirJournal', true);
      setMainData('updateHamirJournal', false);
    }
  }

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/hamir/'+item._id;

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