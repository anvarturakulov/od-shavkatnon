'use client'
import styles from './orderJournal.module.css'
import IcoTrash from './ico/trash.svg'
import IcoSave from './ico/save.svg'
import { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { mutate } from 'swr';
import cn from 'classnames';
import Header from '../../common/header/header';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { deleteItemDocument, getDocument, getNameReference, getPhoneReference, getUserName, setProvodkaToDoc } from '../helpers/journal.functions';
import { getDescriptionDocument } from '@/app/service/documents/getDescriptionDocument';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { dateNumberToString } from '@/app/service/common/converterForDates'
import Footer from '../../common/footer/footer'
import { numberValue } from '@/app/service/common/converters'
import { dashboardUsersList, UserRoles } from '@/app/interfaces/user.interface'
import { Doc } from '../../documents/document/doc/doc'
import { secondsDateToString, secondsToDateString, secondsToDateStringWitoutTime } from '../../documents/document/doc/helpers/doc.functions'
import { OrderJournalProps } from './orderJournal.props'
import { defineUrlTypeForOrder } from '@/app/service/orders/defineUrlTypeForOrder';
import { OrderTypeTitle } from '@/app/interfaces/order.interface';
import { CheckBoxInFooter } from '../helpers/checkBoxInFooter/checkBoxInFooter';

interface FilterForJournal {
    takingDate: string,
    count: string
    analitic: string,
    summa: string,
    receiver: string,
    sender: string,
    deleviry: string,
    comment: string,
    user: string,
    phone: string,
    status: string
}

    
const defaultFilter: FilterForJournal = {
    summa: 'Сумма',
    receiver: 'Олувчи',
    sender: 'Берувчи',
    analitic: 'Аналитика',
    comment: 'Изох',
    user: 'Фойдаланувчи',
    takingDate: 'Бюртма санаси',
    count: 'Сон',
    deleviry: 'Етказиб бориш бор',
    phone: 'Тел ракам',
    status: 'Холат'
}

const documentTotal = (item: DocumentModel) => {
    return numberValue(item.docValues?.total)
}

const totals = (item: DocumentModel) => {
    let total = item.docValues?.total;
    let count = item.docValues?.count;
    return {t: total, c:count}
}


export default function OrderJournal({ className, ...props}:OrderJournalProps):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const {dateStart, dateEnd} = mainData.window.interval;
    const { updateDataForDocumentJournal } = mainData.journal;
    const { journalChechboxs } = mainData.journal;
    const [isDisabled, setIsDisabled] = useState(false);

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
    const { showDocumentWindow, contentName, contentTitle } = mainData.window;
    // console.log(contentTitle)
    const role = user?.role;
    const dashboardUsers = role && dashboardUsersList.includes(role);

    const token = user?.token;
    
    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/byOrderDocumentsForDate'+'?order='+journalChechboxs.order+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    
    if (contentTitle == OrderTypeTitle.TOMORROW) {
        url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/byType/'+DocumentType.Order;
    }
    
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/allForOrdersJournal/';
    const { data : documents, mutate: mutateDocs } = useSWR(url, (url) => getDataForSwr(url, token));
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));
    
    useEffect(() => {
        mutateDocs()
        mutateReferences();
        setMainData && setMainData('updateDataForDocumentJournal', false);
    }, [showDocumentWindow, updateDataForDocumentJournal])

    // useEffect(() => {
    //     mutateReferences()
    // }, [])


    
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

        if (target == 'analitic') {
            title = 'Аналитика ?';
            defaulValue = 'Аналитика';
        }

        if (target == 'comment') {
            title = 'Изох ?'; 
            defaulValue = 'Изох';
        }
        if (target == 'user') {
            title = 'Фойдаланувчи ?';
            defaulValue = 'Фойдаланувчи';
        }
        if (target == 'takingDate') {
            title = 'Буюртма санаси ?';
            defaulValue = 'Буюртма санаси';
        }

        if (target == 'count') {
            title = 'Буюртма сони ?';
            defaulValue = 'Буюртма сони';
        }

        if (target == 'phone') {
            title = 'Тел ракам ?';
            defaulValue = 'Тел ракам';
        }

        if (target == 'status') {
            title = 'Холат ?';
            defaulValue = 'Холат';
        }
        
        let currentValue = prompt(title);
        
        if (!currentValue) currentValue = defaulValue
        
        if (currentValue != null) {
            setFilter(filter => {
                let newObj = {...filter}
                return {
                    ...newObj,
                    [target] : currentValue
                }
            })
        }
        
    }   

    const filteredDocuments = useMemo(() => {
        return (
            documents && documents.length > 0 &&
            documents
                .sort((a: DocumentModel, b: DocumentModel) => {
                    let dateComparison
                    if (a.docValues.orderTakingDate && b.docValues.orderTakingDate) {
                        dateComparison = a.docValues.orderTakingDate - b.docValues.orderTakingDate;
                        if (dateComparison) {
                            return a.docValues.orderTakingDate - b.docValues.orderTakingDate;
                        }
                    } else {
                        if (a.id && b.id) {
                            dateComparison = a.id - b.id;
                            if (dateComparison) {
                                return a.id - b.id;
                            }
                        }
                    }
                })
                .filter((item: DocumentModel) => {
                    if (contentTitle == OrderTypeTitle.OPEN) {
                        const dateOrderInStr = secondsDateToString(item.docValues?.orderTakingDate)
                        const dateOrderInStartDay = Date.parse(dateOrderInStr)
                        const dateNowInStr = secondsDateToString(Date.now())
                        const dateNowInStartDay = Date.parse(dateNowInStr)
                        return (item.docStatus == DocSTATUS.OPEN && dateOrderInStartDay >= dateNowInStartDay)

                        // return item.docStatus == DocSTATUS.OPEN
                    }
                    if (contentTitle == OrderTypeTitle.TOMORROW) {
                        const dateOrderInStr = secondsDateToString(item.docValues?.orderTakingDate)
                        const dateOrderInStartDay = Date.parse(dateOrderInStr)
                        const dateNowInStr = secondsDateToString(Date.now())
                        const dateNowInStartDay = Date.parse(dateNowInStr)
                        return (item.docStatus == DocSTATUS.OPEN && (dateOrderInStartDay - dateNowInStartDay) == 86400000)

                    }
                    if (contentTitle == OrderTypeTitle.COMPLETED) return item.docStatus == DocSTATUS.PROVEDEN
                    if (contentTitle == OrderTypeTitle.DELETED) return item.docStatus == DocSTATUS.DELETED
                    if (contentTitle == OrderTypeTitle.EXPIRED) {
                        const dateOrderInStr = secondsDateToString(item.docValues?.orderTakingDate)
                        const dateOrderInStartDay = Date.parse(dateOrderInStr)
                        const dateNowInStr = secondsDateToString(Date.now())
                        const dateNowInStartDay = Date.parse(dateNowInStr)
                        return (item.docStatus == DocSTATUS.OPEN && dateOrderInStartDay < dateNowInStartDay)

                    }
                    
                })
                .filter((item: DocumentModel) => {
                    const { summa, receiver, sender, comment, user, analitic, phone, status } = filter;
                    const userLowerCase = user.toLowerCase();
                    // const phone = user.toLowerCase();
                    const userName = `${getUserName(item.userId, mainData)}`.toLowerCase();
                    const analiticName = getNameReference(references, item.docValues?.analiticId);
                    const itemComment = item.docValues?.comment;
                    const bigString = `${itemComment}`.toLowerCase();
                    const commentInLowerCase = comment.toLowerCase();
                    const itemSender = getNameReference(references, item.docValues?.senderId);
                    const itemReceiver = getNameReference(references, item.docValues?.receiverId)+' '+getPhoneReference(references, item.docValues?.receiverId);
                    
                    if (user !== 'Фойдаланувчи' && !userName.includes(userLowerCase)) return false;
                    if (comment !== 'Изох' && !bigString.includes(commentInLowerCase)) return false;
                    if (sender !== 'Берувчи' && !(itemSender && itemSender.toLowerCase().includes(sender.toLowerCase()))) return false;
                    if (receiver !== 'Олувчи' && !(itemReceiver && itemReceiver.toLowerCase().includes(receiver.toLowerCase()))) return false;
                    if (analitic !== 'Аналитика' && !(analiticName && analiticName.toLowerCase().includes(analitic.toLowerCase()))) return false;
                    if (summa !== 'Сумма' && item.docValues?.total !== +summa) return false;
                    // if (phone !== 'Тел ракам' && !phone.includes(itemPhone)) return false;
                    
                    return true;
                })
        );
    }, [documents, filter, references, mainData]);

    let count = 0,
        total = 0,
        docCount = 0

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
                                <th key='4' className={styles.rowDate}>Олиб кетиш</th>
                                {/* <th key='5' className={styles.rowDate}>Олиб кетиш вакти</th> */}
                                <th key='9' 
                                    onDoubleClick={() => changeFilter('receiver')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.receiver != 'Олувчи'
                                    })}    
                                    >{filter.receiver}
                                </th>
                                
                                <th key='6' 
                                    onDoubleClick={() => changeFilter('analitic')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.analitic != 'Аналитика'
                                    })}
                                    >{filter.analitic}
                                </th>
                                <th key='7'
                                    className={cn(styles.rowSumma, {
                                        [styles.red]: filter.count != 'Сон'
                                    })}
                                    >{filter.count}</th>
                                <th key='8' 
                                    onDoubleClick={() => changeFilter('summa')} 
                                    className={cn(styles.rowSumma, {
                                        [styles.red]: filter.summa != 'Сумма'
                                    })}
                                    >{filter.summa}
                                </th>

                                <th key='10' 
                                    onDoubleClick={() => changeFilter('sender')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.sender != 'Берувчи'
                                    })}
                                    >{filter.sender}
                                </th>
                                <th key='11'>Етказиб бериш</th>
                                <th key='12' 
                                    onDoubleClick={() => changeFilter('comment')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.comment != 'Изох'
                                    })}
                                >{filter.comment}</th>
                                <th key='13' 
                                    onDoubleClick={() => changeFilter('user')}
                                    className={cn(styles.longRow, {
                                        [styles.red]: filter.user != 'Фойдаланувчи'
                                    })}
                                    >{filter.user}
                                </th>
                                <th key='14' className={styles.rowAction}>Амал</th>
                                <th key='15' className={styles.rowAction}>Амал</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {filteredDocuments && 
                                filteredDocuments.map((item:DocumentModel, key: number) => {
                                    let {t, c} = totals(item)
                                    
                                    total += t ? t : 0;
                                    count += c ? c : 0;
                                    docCount += 1 ? 1 : 0;

                                    return (
                                        <tr 
                                            key={key} 
                                            className={cn(className)}
                                            // onDoubleClick={() => {getDocument(item.id, setMainData, token)}}    
                                        >
                                            <td className={styles.rowId}>{item.id}</td>
                                            <td className={cn(styles.rowDate, {
                                                [styles.proveden]: item.docStatus == DocSTATUS.PROVEDEN,
                                                [styles.deleted]: item.docStatus == DocSTATUS.DELETED,
                                                [styles.expired]: contentTitle == OrderTypeTitle.EXPIRED
                                                })}>
                                                    {secondsToDateString(item.date)}
                                            </td>
                                            {/* <td className={styles.rowDate}>{}</td> */}
                                            <td className={styles.rowDate}>
                                                <div>{secondsToDateStringWitoutTime(item.docValues?.orderTakingDate)}</div>
                                                <div>{item.docValues?.orderTakingTime}</div>
                                            </td>
                                            <td> 
                                                {getNameReference(references,item.docValues?.receiverId)}   
                                                <span> {getPhoneReference(references,item.docValues?.receiverId)}</span>
                                            </td>
                                            <td>{getNameReference(references,item.docValues?.analiticId)}</td>
                                            <td className={cn(styles.rowSumma, styles.tdSumma)}>{numberValue(item.docValues?.count)}</td>
                                            <td className={cn(styles.rowSumma, styles.tdSumma)}>{documentTotal(item)}</td>
                                            <td>{getNameReference(references,item.docValues?.senderId)}</td>
                                            <td>{item.docValues?.orderAdress}</td>
                                            <td>{`${item.docValues?.comment ? `${item.docValues?.comment}`: ''}`}</td>
                                            <td>{getUserName(item.userId, mainData)}</td>
                                            <td className={styles.rowAction}>
                                                <IcoTrash className={cn(styles.icoTrash, {
                                                    [styles.disabled] : isDisabled
                                                })}
                                                onClick = {() => deleteItemDocument(item.id, item.date, token, setMainData, mainData, setIsDisabled)}
                                                disabled = {isDisabled}
                                                />
                                            </td>
                                            <td className={styles.rowAction}>
                                                <IcoSave className={cn(styles.icoTrash, {
                                                    [styles.disabled] : isDisabled
                                                })}
                                                onClick = {() => setProvodkaToDoc(item.id, token ,item.docStatus ,setMainData, mainData, item.docValues?.receiverId, item.docValues?.senderId, setIsDisabled)}
                                                disabled = {isDisabled}
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
                {
                dashboardUsers && 
                
                <Footer label='' windowFor='order' total={total} count={count} docCount={docCount}/>
                }
                {
                    contentTitle != OrderTypeTitle.TOMORROW &&
                    <CheckBoxInFooter id='order' label='Буюртмани олиш санаси буйича интервал'/>                
                }
            </div>
            
        </>
    )
}
