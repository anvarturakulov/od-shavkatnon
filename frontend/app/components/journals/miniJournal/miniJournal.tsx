'use client'
import styles from './miniJournal.module.css'
import {MiniJournalProps} from './miniJournal.props'
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { secondsToDateString } from '../../documents/doc/helpers/doc.functions';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { getDescriptionDocument } from '@/app/service/documents/getDescriptionDocument';
import { DocumentModel, DocumentType, Interval } from '@/app/interfaces/document.interface';
import { UserRoles } from '@/app/interfaces/general.interface';
import { getNameReference } from '../helpers/journal.functions';
import { setProvodkaByReciever } from './helpers/miniJournal.functions';
import { dateNumberToString } from '@/app/service/common/converterForDates';


export default function MiniJournal({ className, ...props}:MiniJournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const { contentName, user } = mainData;
    const {dateStart, dateEnd} = mainData.interval;

    let dateStartForUrl = dateStart
    let dateEndForUrl = dateEnd

    if (!dateStart && !dateEnd) {
        let now = Date.now()+18000000
        let nowInstr = dateNumberToString(now)
        dateStartForUrl = Date.parse(nowInstr)
        dateEndForUrl = Date.parse(nowInstr) + 86399999
    }

    const token = user?.access_token;
    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/document/getAll/';
    // const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/document/byTypeForDate'+'?documentType='+contentName+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/getAll/';

    const { data : documents, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));
    
    useEffect(() => {
        mutate()
        mutateReferences()
        setMainData && setMainData('updateDataForDocumentJournal', false);
    }, [mainData.showDocumentWindow, mainData.updateDataForDocumentJournal])

    // let currentVal: string, today: number

    // currentVal = (new Date()).toISOString().split('T')[0]
    // today = Date.parse(currentVal)
    // let startDate = today
    // let endDate = today +86399999

    return (
        <>
            <div className={styles.title}>Хужжатлар руйхати</div>
            {
                <div className={styles.container} >
                    <table className={styles.table}>
                        <tbody className={styles.tbody}>
                            {documents && documents.length>0 && 
                            documents
                            .filter((item:DocumentModel, key: number) => (item.date >= dateStartForUrl && item.date <= dateEndForUrl))
                            .filter((item:DocumentModel, key: number) => {
                                return (
                                    item.user == user?.name || 
                                    item.receiverId == user?.storageId 
                                )
                            })
                            .sort((a:DocumentModel, b:DocumentModel) => a.date - b.date)
                            .map((item:DocumentModel, key: number) => (
                                <>
                                    <tr 
                                        key={key} 
                                        className={cn(className, {
                                                [styles.deleted]: item.deleted,
                                                [styles.trRow]: 1,
                                                
                                            })}>
                                        <td className={cn(styles.documentType, {
                                            [styles.proveden]: item.proveden
                                        })}>
                                                {getDescriptionDocument(item.documentType)}
                                        </td>
                                        <td>{`${getNameReference(references,item.receiverId)}`}</td>
                                        <td>{getNameReference(references,item.senderId)}</td>
                                        <td className={styles.rowDate}>{secondsToDateString(item.date)}</td>
                                        <td className={cn(styles.rowSumma, styles.tdSumma)}>{item.total ? item.total:item.comment}</td>
                                        <td>{`${getNameReference(references,item.analiticId)? getNameReference(references,item.analiticId): ''} ${item.count ? `(${item.count})`: ''}`}</td>
                                        {
                                            !item.proveden &&
                                            item.receiverId == user?.storageId &&
                                            item.documentType != DocumentType.LeaveCash &&
                                            <td><button 
                                                className={cn(styles.receiveBtn)}
                                                onClick={()=>setProvodkaByReciever(item._id, item.proveden,setMainData,mainData)}
                                                >Кабул килиш</button></td>
                                        }
                                    </tr>
                                </>    
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            
        </>
    )
}
