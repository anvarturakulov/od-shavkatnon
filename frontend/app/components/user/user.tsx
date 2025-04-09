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
import { UserModel, UserRoles } from '@/app/interfaces/user.interface';

export const User = ({ className, ...props }: UserProps) :JSX.Element => {

    const { mainData, setMainData } = useAppContext();
    const { user } = mainData.users
    const { isNewUser, showUserWindow } = mainData.window

    const defaultBody: UserModel = {
        id: 0,
        email: '',
        password: '',
        name: '',
        sectionId: 0,
        role: UserRoles.USER,
        banReason: '',
        banned: false,
    }

    const [body, setBody] = useState<UserModel>(defaultBody) 
    
    const changeElements = (e: React.FormEvent<HTMLInputElement>) => {
        let target = e.currentTarget
        setBody((state:UserModel) => {
            return {
                ...state,
                [target.id]: target.type == 'checkbox' ? target.checked : 
                                                         target.id != 'sectionId' ? target.value : 
                                                                                    +target.value
            }
        })
    }

    useEffect(()=> {
        setBody(body => (
            { ...defaultBody}
        ));
    }, [mainData.window.clearControlElements])

    useEffect(() => {
        const {currentUser} = mainData.users
        
        if (currentUser != undefined) {
            let newBody: UserModel = {
                ...currentUser
            }
            setBody(newBody)
        }
    }, [mainData.users, mainData.users.currentUser])

    return (
        <div className={cn(styles.referenceBox, 
            {[styles.newReference] : isNewUser},
            {[styles.boxClose] : !showUserWindow})}>
            <div className={styles.box}>
                <div className={styles.nameBox}>
                    <div>Email</div>
                    <input value={body.email} type="text" id='email' className={styles.input} onChange={(e)=>changeElements(e)}/>
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
                    <input value={body.sectionId} type="number" id='sectionId' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            </div>

            <div className={styles.box}>
                <div className={styles.nameBox}>
                    <div>Чеклов куйилганлик белгиси</div>
                    <input type='checkbox' id='banned' checked={body.banned} className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
                <div className={styles.nameBox}>
                    <div>Чеклов буйича изох</div>
                    <input value={body.banReason} type="text" id='banReason' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            </div>
            

        <div className={styles.boxBtn}>
            <Button appearance='primary' onClick={() => 
                onSubmitUser(body, 
                            isNewUser,
                            setMainData,
                            user?.token)}
                >Саклаш</Button>
            <Button appearance='ghost' onClick={() => cancelSubmitUser(setMainData)}>Бекор килиш</Button>
        </div> 
    </div>   
    )
} 