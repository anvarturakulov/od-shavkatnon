import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { defaultDocumentFormItems } from '@/app/context/app.context.constants';

export const getDocumentById = (
  id: string | undefined,
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
      setMainData('currentDocument', { ...defaultDocumentFormItems });
    }
    
    const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/document/' + id;
    axios.get(uri, config)
      .then(function (response) {
        setMainData && setMainData('currentDocument', response.data);
        setMainData && showDocument && setMainData('showDocumentWindow', true);
      })
      .catch(function (error) {
        if (setMainData) {
          showMessage(error.message, 'error', setMainData)
        }
      });
  }
}