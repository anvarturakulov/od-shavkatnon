import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { Maindata } from '@/app/context/app.context.interfaces';

export const markToDeleteDocument = (
  id: string | undefined,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  if (id) {
    const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/document/markToDelete/' + id;
    axios.delete(uri, config)
      .then(function () {
        if (setMainData) {
          showMessage(`Хужжат холати узгартирилди`, 'success', setMainData);
          setMainData('updateDataForDocumentJournal', true);
        }
      })
      .catch(function (error) {
        if (setMainData) {
          showMessage(error.message, 'error', setMainData)
        }
      });
  }
}