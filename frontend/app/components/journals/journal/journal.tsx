'use client'
import styles from './journal.module.css'
import IcoTrash from './ico/trash.svg'
import IcoSave from './ico/save.svg'
import {JournalProps} from './journal.props'
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import Header from '../../common/header/header';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { deleteItemDocument, getDocument, getNameReference, getUserName, isDirector, isFounder, setProvodkaToDoc } from '../helpers/journal.functions';
import { getDescriptionDocument } from '@/app/service/documents/getDescriptionDocument';
import { DocSTATUS, DocumentModel, DocumentType, Interval } from '@/app/interfaces/document.interface';
import { dateNumberToString } from '@/app/service/common/converterForDates'
import Footer from '../../common/footer/footer'
import { numberValue } from '@/app/service/common/converters'
import { CheckBoxInFooter } from '../helpers/checkBoxInFooter/checkBoxInFooter'
import { dashboardUsersList, UserRoles } from '@/app/interfaces/user.interface'
import { Doc } from '../../documents/document/doc/doc'
import { secondsToDateString } from '../../documents/document/doc/helpers/doc.functions'


interface FilterForJournal {
    summa: string,
    receiver: string,
    sender: string,
    comment: string,
    user: string
}
    
const defaultFilter: FilterForJournal = {
    summa: 'Сумма',
    receiver: 'Олувчи',
    sender: 'Берувчи',
    comment: 'Изох',
    user: 'Фойдаланувчи'
}

const documentTotal = (item: DocumentModel) => {
    if (
        (item.documentType == DocumentType.LeaveMaterial ||
        item.documentType == DocumentType.ComeHalfstuff) &&
        item.docTableItems?.length 
    ) return numberValue(item.docTableItems.reduce((summa, item) => summa + item.total,0))

    return numberValue(item.docValues?.total)
}

const totals = (item: DocumentModel) => {
    let total = item.docValues?.total;
    let count = item.docValues?.count;

    if (( item.documentType == DocumentType.LeaveMaterial ||  item.documentType == DocumentType.ComeHalfstuff) 
        && item.docTableItems?.length ) {
        let t = item.docTableItems.reduce((summa, item) => summa + item.total,0)
        let c = item.docTableItems.reduce((count, item) => count + item.count,0)
        total = t;
        count = c;
    }

    return {t: total, c:count}
}

export default function Journal({ className, ...props}:JournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const {dateStart, dateEnd} = mainData.window.interval;
    const { journalChechboxs, updateDataForDocumentJournal } = mainData.journal;

    let dateStartForUrl = dateStart
    let dateEndForUrl = dateEnd

    if (!dateStart && !dateEnd) {
        let now = Date.now()+18000000
        let nowInstr = dateNumberToString(now)
        dateStartForUrl = Date.parse(nowInstr)
        dateEndForUrl = Date.parse(nowInstr) + 86399999
    }
    
    const [filter, setFilter] = useState<FilterForJournal>(defaultFilter);

    const { user } = mainData.users;
    const { showDocumentWindow, contentName } = mainData.window;
    const role = user?.role;
    const dashboardUsers = role && dashboardUsersList.includes(role);

    const token = user?.token;
    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/byTypeForDate'+'?documentType='+contentName+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    
    if (!contentName) {
        let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/all/';
    }

    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/all/';

    const { data : documents, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));

    
    useEffect(() => {
        mutate()
        mutateReferences()
        setMainData && setMainData('updateDataForDocumentJournal', false);
    }, [showDocumentWindow, updateDataForDocumentJournal])

    const changeFilter = (target: string) => {
        let title: string = '';
        let defaulValue: string = '';
        if (target == 'summa') {
            title = 'Хужжат суммаси ?';
            defaulValue = 'Сумма';
        }
        if (target == 'receiver') {
            title = 'Олувчи ?';
            defaulValue = 'Олувчи';
        }
        if (target == 'sender') {
            title = 'Берувчи ?';
            defaulValue = 'Берувчи';
        }
        if (target == 'comment') {
            title = 'Изох ?'; 
            defaulValue = 'Изох';
        }
        if (target == 'user') {
            title = 'Фойдаланувчи ?';
            defaulValue = 'Фойдаланувчи';
        }
        
        let currentValue = prompt(title);
        
        if (currentValue == '') currentValue = defaulValue

        setFilter(filter => {
            let newObj = {...filter}
            return {
                ...newObj,
                [target] : currentValue
            }
        })
    }   

    let count:number = 0;
    let total: number = 0;
    let docCount: number = 0;


    return (
        <>
            {dashboardUsers && <Header windowFor='document' total={total} count={count}/>}  
            <>
                <div className={styles.newElement}>
                    {showDocumentWindow && <Doc/>}
                </div>
            </>
            
            {
                dashboardUsers && 
                <div className={styles.container} >
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr key='-1'>
                                <th key='1' className={styles.rowId}>Раками </th>
                                <th key='2' className={styles.rowDate}>Сана</th>
                                <th key='4'>Хужжат тури</th>
                                <th key='5' 
                                    onDoubleClick={() => changeFilter('summa')} 
                                    className={cn(styles.rowSumma, {
                                        [styles.red]: filter.summa != 'Сумма'
                                    })}
                                    >{filter.summa}
                                </th>
                                <th key='6' 
                                    onDoubleClick={() => changeFilter('receiver')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.receiver != 'Олувчи'
                                    })}    
                                    >{filter.receiver}
                                </th>
                                <th key='7' 
                                    onDoubleClick={() => changeFilter('sender')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.sender != 'Берувчи'
                                    })}
                                    >{filter.sender}
                                </th>
                                <th key='8' 
                                    onDoubleClick={() => changeFilter('comment')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.comment != 'Изох'
                                    })}
                                >{filter.comment}</th>
                                <th key='9' 
                                    onDoubleClick={() => changeFilter('user')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.user != 'Фойдаланувчи'
                                    })}
                                    >{filter.user}
                                </th>
                                <th key='10' className={styles.rowAction}>Амал</th>
                                <th key='11' className={styles.rowAction}>Амал</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {documents && documents.length>0 && 
                            documents
                            .sort((a:DocumentModel, b:DocumentModel) => {
                                const dateComparison = a.date - b.date;

                                if (dateComparison === 0 && a.id && b.id) {
                                    return a.id - b.id;
                                }
                                
                                return dateComparison;
                            })
                            .filter((item:DocumentModel) => {
                                if (journalChechboxs.charges ) {
                                    if (!item.docValues?.isWorker && !item.docValues?.isPartner) return true
                                } else return true
                            })
                            .filter((item:DocumentModel) => {
                                if (journalChechboxs.workers ) {
                                    if (item.docValues?.isWorker) return true
                                } else return true
                            })
                            .filter((item:DocumentModel) => {
                                if (journalChechboxs.partners ) {
                                    if (item.docValues?.isPartner) return true
                                } else return true
                            })
                            .filter((item:DocumentModel) => {
                                const {user} = filter
                                const userLowerCase = user.toLocaleLowerCase()
                                const userName = `${getUserName(item.userId, mainData)}`.toLocaleLowerCase()
                                if (user != 'Фойдаланувчи') {
                                    if (userName.includes(userLowerCase)) return true
                                } else return true
                            })
                            
                            .filter((item:DocumentModel) => {
                                const {comment} = filter
                                const analiticName = getNameReference(references,item.docValues?.analiticId)
                                const itemComment = item.docValues?.comment
                                const bigString = `${itemComment}${analiticName}`.toLocaleLowerCase()
                                const commentInLowerCase = comment.toLocaleLowerCase()
                                
                                if (comment != 'Изох' && analiticName) {
                                    if (bigString.includes(commentInLowerCase)) return true
                                } else return true
                            })
                            .filter((item:DocumentModel) => {
                                const {sender} = filter
                                const itemSender = getNameReference(references,item.docValues?.senderId)
                                if (sender != 'Берувчи') {
                                    if (itemSender && itemSender.toLowerCase().includes(sender.toLocaleLowerCase())) return true
                                } else return true
                            })
                            .filter((item:DocumentModel) => {
                                const {receiver} = filter
                                const itemReceiver = getNameReference(references,item.docValues?.receiverId)
                                if (receiver != 'Олувчи') {
                                    if (itemReceiver && itemReceiver.toLowerCase().includes(receiver.toLocaleLowerCase())) return true
                                } else return true
                            })
                            .filter((item:DocumentModel) => {
                                const {summa} = filter
                                if (summa != 'Сумма') {
                                    if (item.docValues?.total == +summa) return true
                                } else return true
                            })
                            .filter((item:DocumentModel) => {
                                if (role != UserRoles.ADMIN && role != UserRoles.HEADCOMPANY) {
                                    if (isDirector(references, item.docValues?.senderId)) return false
                                    if ( isFounder(references, item.docValues?.senderId) ||
                                         isFounder(references, item.docValues?.receiverId)
                                    ) return false
                                }
                                return true
                            })
                            .map((item:DocumentModel, key: number) => {
                                let {t, c} = totals(item)
                                total += item.docStatus != DocSTATUS.DELETED ? t : 0;
                                count += item.docStatus != DocSTATUS.DELETED ? c : 0;
                                docCount += item.docStatus != DocSTATUS.DELETED ? 1 : 0;
                                return (
                                    <tr 
                                        key={key} 
                                        className={cn(className)}
                                        onDoubleClick={() => {getDocument(item.id, setMainData, token)}}    
                                    >
                                        <td className={styles.rowId}>{item.id}</td>
                                        <td className={styles.rowDate}>{secondsToDateString(item.date)}</td>
                                        <td className={cn(styles.documentType, {
                                               [styles.proveden]: item.docStatus == DocSTATUS.PROVEDEN,
                                               [styles.deleted]: item.docStatus == DocSTATUS.DELETED
                                            })}>
                                                {getDescriptionDocument(item.documentType)}
                                        </td>
                                        <td className={cn(styles.rowSumma, styles.tdSumma)}>{documentTotal(item)}</td>
                                        <td>{getNameReference(references,item.docValues?.receiverId)}</td>
                                        <td>{getNameReference(references,item.docValues?.senderId)}</td>
                                        <td>{`${getNameReference(references,item.docValues?.analiticId)? getNameReference(references,item.docValues?.analiticId): ''} ${item.docValues?.comment ? `(${item.docValues?.comment})`: ''} ${item.docValues?.count ? `(${item.docValues?.count})`: ''}`}</td>
                                        <td>{getUserName(item.userId, mainData)}</td>
                                        <td className={styles.rowAction}>
                                            <IcoTrash className={styles.icoTrash}
                                            onClick = {() => deleteItemDocument(item.id, item.date, token, setMainData, mainData)}
                                            />
                                        </td>
                                        <td className={styles.rowAction}>
                                            <IcoSave className={styles.icoSave}
                                            onClick = {() => setProvodkaToDoc(item.id, token ,item.docStatus ,setMainData, mainData, item.docValues?.receiverId)}
                                            />
                                        </td>
                                    </tr>
                                 )   
                            })
                            }
                        </tbody>
                    </table>
                </div>
            }
            <div className={styles.footer}>
                {dashboardUsers && <Footer windowFor='document' total={total} count={count} docCount={docCount}/>} 
            {
                contentName == DocumentType.LeaveCash &&
                <div className={styles.checkboxs}>
                    <CheckBoxInFooter id='charges' label='Харажат'/>
                    <CheckBoxInFooter id='workers' label='Иш хаки'/>
                    <CheckBoxInFooter id='partners' label='Таъминотчи'/>
                </div>
                
            }
            </div>
            
            
        </>
    )
}
