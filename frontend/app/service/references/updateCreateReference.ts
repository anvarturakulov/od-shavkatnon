import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import axios from 'axios';
import { showMessage } from '../common/showMessage';
import { getBodyForReferenceRequest } from './getBodyForReferenceRequest';

export const updateCreateReference = (
  body: ReferenceModel,
  typeReference: TypeReference,
  isNewReference: boolean,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const actionWithMainData = (mes: string) => {
    if (setMainData) {
      showMessage(`${body.name} - ${typeReference} - ${mes}`, 'success', setMainData)
      setMainData('showReferenceWindow', false);
      setMainData('clearControlElements', true);
      setMainData('isNewReference', false);
    }
  }

  const id = body.id;
  delete body.id;

  const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/reference/create';
  const uriPatch = process.env.NEXT_PUBLIC_DOMAIN + '/api/reference/' + id;

  if (isNewReference) {
    axios.post(uriPost, getBodyForReferenceRequest(body, typeReference), config)
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
      axios.patch(uriPatch, getBodyForReferenceRequest(body, typeReference), config)
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