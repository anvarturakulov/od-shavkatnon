'use client'
import { useEffect, useState } from 'react';
import { UserProps } from './user.props';
import styles from './user.module.css';
import cn from 'classnames';
import { Button} from '@/app/components';
import {  userRolesList } from './helpers/user.constants';
import { useAppContext } from '@/app/context/app.context';
import { SelectForUser } from './helpers/user.components';
import { cancelSubmitUser, onSubmitUser } from './helpers/user.functions';
import { UserRoles } from '@/app/interfaces/general.interface';
import { UserModel } from '@/app/interfaces/user.interface';

export const User = ({ className, ...props }: UserProps) :JSX.Element => {

    const {mainData, setMainData} = useAppContext();
    
    const defaultBody: UserModel = {
        _id: '',
        login: '',
        password: '',
        role: UserRoles.HAMIRCHI,
        name: '',
        storageId: '',
        tandirId: '',
        productId: '',
        deleted: false,
    }

    const [body, setBody] = useState<UserModel>(defaultBody) 
    const changeElements = (e: React.FormEvent<HTMLInputElement>) => {
        let target = e.currentTarget
        setBody((state:UserModel) => {
            return {
                ...state,
                [target.id]: target.value
            }
        })
    }

    // const setCheckbox = (checked: boolean, id: string) => {
    //     setBody((state:ReferenceModel) => {
    //         return {
    //             ...state,
    //             [`${id}`]: checked
    //         }
    //     })
    // }

    useEffect(()=> {
        setBody(defaultBody);
    }, [mainData.clearControlElements])

    useEffect(() => {
        const {currentUser} = mainData
        
        if (currentUser != undefined) {
            const { login, password, role, name, storageId, tandirId,
                productId, deleted } = currentUser
                console.log('currentUser', currentUser)
            let newBody: UserModel = {
                ...currentUser,
            }
            setBody(newBody)
        }
    }, [mainData.currentUser])

    const {isNewUser, showUserWindow, user} = mainData

    return (
        <div className={cn(styles.referenceBox, 
            {[styles.newReference] : isNewUser},
            {[styles.boxClose] : !showUserWindow})}>
            <div className={styles.box}>
                <div className={styles.nameBox}>
                    <div>Email</div>
                    <input value={body.login} type="text" id='login' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>

                <div className={styles.nameBox}>
                    <div>Калит суз</div>
                    <input value={body.password} type="text" id='password' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            </div> 
            

            {
                SelectForUser(userRolesList, body, 'Фойдаланувчи тури', changeElements)
            }

            
            <div className={styles.box}>
                <div className={styles.nameBox}>
                    <div>Исми</div>
                    <input value={body.name} type="text" id='name' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            
                <div className={styles.nameBox}>
                    <div>storageId</div>
                    <input value={body.storageId} type="text" id='storageId' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>

                <div className={styles.nameBox}>
                    <div>tandirId</div>
                    <input value={body.tandirId} type="text" id='tandirId' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>

                <div className={styles.nameBox}>
                    <div>productId</div>
                    <input value={body.productId} type="text" id='productId' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            </div>
            

        <div className={styles.boxBtn}>
            <Button appearance='primary' onClick={() => 
                onSubmitUser(body, 
                            isNewUser,
                            setMainData,
                            user?.access_token)}
                >Саклаш</Button>
            <Button appearance='ghost' onClick={() => cancelSubmitUser(setMainData)}>Бекор килиш</Button>
        </div> 
    </div>   
    )
} 