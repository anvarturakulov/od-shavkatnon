import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { getDocumentById } from './getDocumentById';
import { Maindata } from '@/app/context/app.context.interfaces';

export const setProvodkaToDocument = async (
  id: number | undefined,
  setMainData: Function | undefined,
  mainData: Maindata
) => {
  
  const { user } = mainData.users;
  const token = user?.access_token;

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  let temp = {}
  
  if (id) {
    const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/document/setProvodka/' + id;
    axios.patch(uri, temp, config)
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