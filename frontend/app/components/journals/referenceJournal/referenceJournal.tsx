'use client'
import styles from './referenceJournal.module.css'
import cn from 'classnames';
import IcoTrash from './ico/trash.svg'
import { useEffect } from 'react';
import { Reference } from '../../reference/reference';
import { ReferenceModel } from '../../../interfaces/reference.interface';
import useSWR from 'swr';
import { ReferenceJournalProps } from './referenceJournal.props';
import { useAppContext } from '@/app/context/app.context';
import Header from '../../common/header/header';
import { getTypeReference } from '@/app/service/references/getTypeReference';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { deleteItemReference, getReference } from './helpers/reference.functions';
import { getNameReference } from '../helpers/journal.functions';
import { sortByName } from '@/app/service/references/sortByName';

export default function ReferenceJournal({className, ...props}:ReferenceJournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const { contentName, user } = mainData;
    const referenceType = getTypeReference(contentName);
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/'+referenceType;
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/getAll/';

    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));


    useEffect(() => {
        mutate()
        setMainData && setMainData('updateDataForRefenceJournal', false);
    }, [mainData.showReferenceWindow, mainData.updateDataForRefenceJournal])

    return (
        <>  
            <Header windowFor='reference' />
            <div className={styles.newElement}>
                <Reference/>
            </div>
            <div className={styles.container} >
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.rowId}>№</th>
                            <th className={styles.name}>Номи</th>
                            {
                                referenceType == 'TMZ' &&
                                <>
                                    <th className={styles.types}>Ул. бир.</th>
                                    <th className={styles.types}>ТМБ тури</th>
                                </>
                            }
                            {
                                referenceType == 'PARTNERS' &&
                                <>
                                    <th className={styles.types}>Хамкор тури</th>
                                    <th className={styles.types}>Сохиби</th>
                                </>
                            }
                            <th className={styles.comment}>Изох</th>
                            <th className={styles.rowAction}>Амал</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {data && 
                        data.length>0 && 
                        data
                        .sort(sortByName)
                        .map((item:ReferenceModel, key:number) => (
                            <>
                                <tr 
                                    key={key+0} 
                                    onDoubleClick={() => {getReference(item._id, setMainData, token)}} 
                                    className={cn(className, {
                                            [styles.deleted]: item.deleted,
                                            [styles.trRow]: 1,
                                        })}   
                                >
                                    <td className={styles.rowId}>{item._id}</td>
                                    <td className={cn(className, {
                                            [styles.name]: 1,
                                        })}
                                    >{item.name}</td>
                                    {
                                        referenceType == 'TMZ' &&
                                        <>
                                            <td className={styles.types}>{item.unit}</td>
                                            <td className={styles.types}>{item.typeTMZ}</td>
                                        </>
                                    }
                                    {
                                        referenceType == 'PARTNERS' &&
                                        <>
                                            <td className={styles.types}>{item.typePartners}</td>
                                             <td className={styles.types}>{getNameReference(references,item.clientForDeliveryId)}</td>
                                        </>
                                    }
                                    <td className={styles.comment}>{item.comment}</td>
                                    <td className={styles.rowAction}>
                                        <IcoTrash 
                                            // className={styles.icoTrash}
                                            className={cn(className,styles.icoTrash, {
                                                [styles.deleted]: item.deleted,
                                            })}  
                                            onClick = {() => deleteItemReference(item._id, item.name, token, setMainData)}
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
