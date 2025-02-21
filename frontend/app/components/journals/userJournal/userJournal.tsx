'use client'
import styles from './userJournal.module.css'
import cn from 'classnames';
import IcoTrash from './ico/trash.svg'
import { useEffect } from 'react';
import useSWR from 'swr';
import { UserJournalProps } from './userJournal.props';
import { useAppContext } from '@/app/context/app.context';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { deleteItemUser, getUser } from './helpers/user.functions';
import { sortByName } from '@/app/service/references/sortByName';
import HeaderForUser from '../../common/headerForUsers/headerForUsers';
import { UserModel } from '@/app/interfaces/user.interface';
import { User } from '../../user/user';

export default function ReferenceJournal({className, ...props}:UserJournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const { updateDataForUserJournal } = mainData.journal
    const { showReferenceWindow } = mainData.window
    
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/auth/getAll/';

    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));

    useEffect(() => {
        mutate()
        setMainData && setMainData('updateDataForUserJournal', false);
    }, [showReferenceWindow, updateDataForUserJournal])

    return (
        <>  
            <HeaderForUser/>
            <div className={styles.newElement}>
                <User/>
            </div>
            <div className={styles.container} >
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.rowId}>№</th>
                            <th className={styles.name}>Номи</th>
                            <th className={styles.name}>Тури</th>
                            <th className={styles.rowAction}>Амал</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {data && 
                        data.length>0 && 
                        data
                        .sort(sortByName)
                        .map((item:UserModel, key:number) => (
                            <>
                                <tr 
                                    key={key+0} 
                                    onDoubleClick={() => {getUser(item.id, setMainData, token)}} 
                                    className={cn(className, {
                                            [styles.deleted]: item.banned,
                                            [styles.trRow]: 1,
                                        })}   
                                >
                                    <td className={styles.rowId}>{item.id}</td>
                                    <td className={cn(className, {
                                            [styles.name]: 1,
                                        })}
                                    >{item.name}</td>
                                    <td className={styles.types}>{'????'}</td>
                                    <td className={styles.rowAction}>
                                        <IcoTrash 
                                            // className={styles.icoTrash}
                                            className={cn(className,styles.icoTrash, {
                                                [styles.deleted]: item.banned,
                                            })}  
                                            onClick = {() => deleteItemUser(item.id, item.name, token, setMainData)}
                                            />
                                    </td>
                                </tr>
                            </>    
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
