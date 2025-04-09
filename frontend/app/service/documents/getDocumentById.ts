import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { defaultDocument } from '@/app/context/app.context.constants';

export const getDocumentById = (
  id: number | undefined,
  setMainData: Function | undefined,
  token: string | undefined,
  showDocument : boolean = true
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  if (id) {

    if (setMainData) {
      setMainData('clearControlElements', true);
      setMainData('showDocumentWindow', false);
      setMainData('isNewDocument', false);
      setMainData('currentDocument', { ...defaultDocument });
    }
    
    const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/' + id;
    axios.get(uri, config)
      .then(function (response) {
        const data = {...response.data, date: +response.data.date }
        setMainData && setMainData('currentDocument', data);
        setMainData && showDocument && setMainData('showDocumentWindow', true);
      })
      .catch(function (error) {
        if (setMainData) {
          showMessage(error.message, 'error', setMainData)
        }
      });
  }
}