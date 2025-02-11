import { Maindata } from '@/app/context/app.context.interfaces';
import { HamirModel } from '@/app/interfaces/hamir.interface';
import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { UserRoles } from '@/app/interfaces/general.interface';

export const createHamirsForDayByUser = (date: number, mainData: Maindata, setMainData: Function | undefined) => {
  const { user, currentStorageIdInHamirsJournal, definedTandirWorkers } = mainData
  
  let body: HamirModel = {
    date,
    sectionId: user?.storageId ? user.storageId : '',
    analiticId: user?.productId ? user.productId : '',
    proveden: false,
    user : user?.name ? user.name : '',
    fromHamirchi: user?.role == UserRoles.HAMIRCHI ? true : false,
    firstWorker: definedTandirWorkers.firstWorker,
  }

  if (user?.role == UserRoles.TANDIR) {
    body = {
      ...body,
      secondWorker: definedTandirWorkers.secondWorker,
      thirdWorker: definedTandirWorkers.thirdWorker
    } 
  }

  // console.log(body);
  if ((user?.role == UserRoles.TANDIR) && (
    !body.firstWorker || !body.secondWorker || !body.thirdWorker )) {
      showMessage(`Ходимлар танланмаган`, 'error', setMainData)
      return
    }

  if ((user?.role == UserRoles.HAMIRCHI) && !body.firstWorker ) {
    showMessage(`Ходим танланмаган`, 'error', setMainData)
    return
  }

  if (user?.productId == '' ) {
    showMessage(`Ходимда productId йук`, 'error', setMainData)
    return
  }
  console.log(user?.productId)
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