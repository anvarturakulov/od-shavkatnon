import { Maindata } from '@/app/context/app.context.interfaces';
import { SendingHamir } from '@/app/interfaces/hamir.interface';
import { showMessage } from '../common/showMessage';
import axios from 'axios';

export const changeStatusHamir = (hamir: SendingHamir, mainData: Maindata, setMainData: Function | undefined) => {
  const { user } = mainData.users

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

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/sendhamirs/'+hamir.id;

  axios.patch(uriPost, hamir, config)
    .then(function (request) {
      actions('')
    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });
  
}