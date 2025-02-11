import { getReferenceById } from '@/app/service/references/getReferenceById';
import { getUserById } from '@/app/service/users/getUserById';
import { markToDeleteUser } from '@/app/service/users/markToDeleteUser';

export const deleteItemUser = (id: string | undefined, name: string, token: string | undefined, setMainData: Function | undefined) => {
  markToDeleteUser(id, name, setMainData, token)
}

export const getUser = async (
  id: string | undefined,
  setMainData: Function | undefined,
  token: string | undefined
) => {
  if (id) {
    const user = await getUserById(id, setMainData, token);
  }
  setMainData && setMainData('isNewUser', false);
}