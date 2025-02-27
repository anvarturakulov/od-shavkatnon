import axios from 'axios';
import { showMessage } from './showMessage';
import { BodyForLogin } from '@/app/interfaces/user.interface';

export const loginToApp = (body: BodyForLogin, setMainData: Function | undefined) => {
  const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/login';
  axios.post(uri, body)
    .then(function (response) {
      setMainData && setMainData('user', response.data);
    })
    .catch(function (error) {
      if (setMainData) {
        if (error.response.status == 401) {
          showMessage('Фойдаланувчи маълумотлари хато киритилди', 'error', setMainData)
        } else {
          showMessage(error.message, 'error', setMainData)
        }
      }
    });
}