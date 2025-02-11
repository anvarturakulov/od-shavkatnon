import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { UserModel } from '@/app/interfaces/user.interface';
import { showMessage } from '@/app/service/common/showMessage';
import { updateCreateReference } from '@/app/service/references/updateCreateReference';
import { updateCreateUser } from '@/app/service/users/updateCreateUser';

export const cancelSubmitUser = (setMainData: Function | undefined) => {
    if (setMainData) {
        setMainData('clearControlElements', true);
        setMainData('showUserWindow', false);
        setMainData('isNewUser', false);
    }
}

export const onSubmitUser = (
    body: UserModel,
    isNewReference: boolean, 
    setMainData: Function| undefined,
    token: string | undefined) => {
    
    if (body.role == undefined) {
        showMessage('Фойдаланувчи турини танланг', 'error', setMainData);
        return
    }

    console.log(body)
    
    if (body.name.trim().length != 0) {
        updateCreateUser(body, isNewReference, setMainData, token);
    } else {
        showMessage('Номини тулдиринг', 'error', setMainData);
    }
}