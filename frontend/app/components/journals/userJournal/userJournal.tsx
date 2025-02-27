'use client'
import styles from './userJournal.module.css'
import cn from 'classnames';
import IcoTrash from './ico/trash.svg'
import IcoBan from './ico/ban.svg'
import { useEffect } from 'react';
import useSWR from 'swr';
import { UserJournalProps } from './userJournal.props';
import { useAppContext } from '@/app/context/app.context';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { banRestoreUser, getUser } from './helpers/user.functions';
import { sortByName } from '@/app/service/references/sortByName';
import HeaderForUser from '../../common/headerForUsers/headerForUsers';
import { UserModel } from '@/app/interfaces/user.interface';
import { User } from '../../user/user';

export default function UserJournal({className, ...props}:UserJournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const { updateDataForUserJournal } = mainData.journal
    const { showReferenceWindow } = mainData.window
    
    const token = user?.token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/users/all/';

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
                            <th className={styles.id}>№</th>
                            <th>Номи</th>
                            <th>Email</th>
                            <th>Тури</th>
                            <th className={styles.rowAction}>Амал</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {
                            data && 
                            data.length>0 && 
                            data
                            .sort(sortByName)
                            .map((item:UserModel, key:number) => {
                                return (
                                    <tr 
                                        key={item.id} 
                                        onDoubleClick={() => {getUser(item.id, setMainData, token)}} 
                                        className={cn(className, {
                                                [styles.banned]: item.banned,
                                            })}   
                                    >
                                        <td className={styles.id}>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.role}</td>
                                        <td className={styles.rowAction}>
                                            <IcoBan 
                                                className={cn(className,styles.icoTrash, {
                                                    [styles.banned]: item.banned,
                                                })}  
                                                onClick = {() => banRestoreUser(item.id, user?.name, user?.banned, setMainData, token)}
                                                />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}
