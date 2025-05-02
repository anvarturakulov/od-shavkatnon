import { Maindata } from '@/app/context/app.context.interfaces';
import { HamirModel } from '@/app/interfaces/hamir.interface';
import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { OrderStatus } from '@/app/interfaces/order.interface';

export const createHamirsForDayByUser = (date: number, mainData: Maindata, setMainData: Function | undefined) => {
  const { user } = mainData.users
  
  if (!user?.id || !user?.sectionId) return
  
  let body:DocumentModel = {
    date,
    docValues: {
      senderId: user?.sectionId,
      receiverId: 0,
      count: 0,
      price: 0,
      total: 0,
      orderTakingDate: 0,
      orderTakingTime: '',
      orderWithDeleviry: false,
      orderAdress: '',
      orderStatus: OrderStatus.OPEN,
    },
    docStatus: DocSTATUS.OPEN,
    userId : user?.id,
    documentType: DocumentType.ComeProduct,
    docTableItems: []
  }

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

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/createhamirs';

  axios.post(uriPost, body, config)
    .then(function (request) {
      actions('')
      
    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });
  
}