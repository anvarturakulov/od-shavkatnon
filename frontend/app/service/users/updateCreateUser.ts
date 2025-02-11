import { ReferenceModel } from '@/app/interfaces/reference.interface';
import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { UserModel } from '@/app/interfaces/user.interface';

export const updateCreateUser = (
  body: UserModel,
  isNewReference: boolean,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  console.log(config)
  const actionWithMainData = (mes: string) => {
    if (setMainData) {
      showMessage(`${body.name} - ${mes}`, 'success', setMainData)
      setMainData('showUserWindow', false);
      setMainData('clearControlElements', true);
      setMainData('isNewUser', false);
    }
  }

  console.log(body)
  const id = body._id;
  delete body._id;
  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/register';
  const uriPatch = process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/' + id;
  console.log('body', body, ' id - ', id, ' uriPath - ', uriPatch);

  if (isNewReference) {
    axios.post(uriPost, body, config)
      .then(function () {
        actionWithMainData('янги элемент киритилди')
      })
      .catch(function (error) {
        if (setMainData) {
          showMessage(error.message, 'error', setMainData)
        }
      });
  } else {
    if (id) {
      axios.patch(uriPatch, body, config)
        .then(function () {
          actionWithMainData('элемент янгиланди')
        })
        .catch(function (error) {
          if (setMainData) {
            showMessage(error.message, 'error', setMainData)
          }
        });
    };
  }
}