import axios from 'axios';
import { showMessage } from '../common/showMessage';

export const getReferenceById = (
  id: string | undefined,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  if (id) {
    const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/reference/' + id;
    axios.get(uri, config)
      .then(function (response) {
        console.log(response.data)
        setMainData && setMainData('currentReference', response.data);
        setMainData && setMainData('showReferenceWindow', true);
      })
      .catch(function (error) {
        if (setMainData) {
          showMessage(error.message, 'error', setMainData)
        }
      });
  }
}