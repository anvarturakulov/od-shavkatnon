import { Maindata } from '@/app/context/app.context.interfaces';
import { HamirModel } from '@/app/interfaces/hamir.interface';
import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { DocSTATUS } from '@/app/interfaces/document.interface';
import { UserRoles } from '@/app/interfaces/user.interface';

export const createHamirsForDayByUser = (date: number, mainData: Maindata, setMainData: Function | undefined) => {
  const { user } = mainData.users
  const { definedTandirWorkers } = mainData.document
  
  let body: HamirModel = {
    date,
    sectionId: user?.sectionId ? user.sectionId : -1,
    analiticId: -1,
    docStatus: DocSTATUS.OPEN,
    user : user?.name ? user.name : '',
    firstWorker: definedTandirWorkers.firstWorker,
  }

  if (user?.role == UserRoles.TANDIR) {
    body = {
      ...body,
      secondWorker: definedTandirWorkers.secondWorker,
      thirdWorker: definedTandirWorkers.thirdWorker
    } 
  }

  if ((user?.role == UserRoles.TANDIR) && (
    !body.firstWorker || !body.secondWorker || !body.thirdWorker )) {
      showMessage(`Ходимлар танланмаган`, 'error', setMainData)
      return
    }

  if (!body.firstWorker ) {
    showMessage(`Ходим танланмаган`, 'error', setMainData)
    return
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

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/hamir/create';

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