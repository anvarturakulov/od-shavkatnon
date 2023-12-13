'use client'
import { Button, Htag } from '@/app/components'
import styles from './journal.module.css'
import cn from 'classnames';
import {JournalProps} from './journal.props'
import classNames from 'classnames';
import { DocumentState, DocumentType } from '../../interfaces/documents/mainDocument.interface';
import IcoTrash from './ico/trash.svg'
import ShowIco from './ico/view.svg'
import Header from '../header/header';
import { useEffect, useRef, useState } from 'react';
import { Document } from '../document/document';


export default function Journal({ documents, contentTitle, contentType, className, ...props}:JournalProps):JSX.Element {
    
    const [visibilityNewElement, setVisibilityNewElement] = useState<boolean>(false)
    useEffect(()=> {
        setVisibilityNewElement(false)
    }, [contentTitle])

    return (
        <>
            <Header contentType={contentType} contentTitle={contentTitle} setVisibilityNewElement={setVisibilityNewElement} visibilityNewElement={visibilityNewElement}/>  
            <div className={styles.newElement}>
                {visibilityNewElement && <Document documentType={contentTitle}/>}
            </div>
            <div className={styles.container} >
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.rowId}>_id </th>
                            <th className={styles.rowDate}>Сана</th>
                            <th>Хужжат холати</th>
                            <th>Хужжат тури</th>
                            <th className={styles.rowSumma}>Сумма</th>
                            <th>Олувчи</th>
                            <th>Берувчи</th>
                            <th>Изох 2</th>
                            <th className={styles.rowAction}>Амал</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {documents?.map((item, key) => (
                            <>
                                <tr 
                                    key={key} 
                                    onDoubleClick={() => {alert(item.receiverId)}} 
                                    className={styles.trRow}    
                                >
                                    <td className={styles.rowId}>{item._id}</td>
                                    <td className={styles.rowDate}>{item.date}</td>
                                    <td
                                        className={cn(className, {
                                            [styles.deleted]: item.state == DocumentState.Deleted,
                                            [styles.proveden]: item.state == DocumentState.Proveden,
                                            [styles.error]: item.state == DocumentState.Error,
                                            [styles.saved]: item.state == DocumentState.Saved,
                                        })}
                                    >{item.state}</td>
                                    <td
                                        className={cn(className, {
                                            [styles.error]: item.documentType == DocumentType.Error,
                                        })}
                                    >{item.documentType}</td>
                                    <td className={cn(styles.rowSumma, styles.tdSumma)}>1.200.000</td>
                                    <td>{item.senderId}</td>
                                    <td>{item.receiverId}</td>
                                    <td>Изох</td>
                                    <td className={styles.rowAction}>
                                        <IcoTrash className={styles.icoTrash}/>
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