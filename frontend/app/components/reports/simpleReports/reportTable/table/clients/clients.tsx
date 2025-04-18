'use client'
import styles from './clients.module.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import { ClientProps } from './clients.props';
import { ClientItem } from './clientItem/clientItem';

export const Clients = ({className, ...props }: ClientProps) :JSX.Element => {
    const { setMainData, mainData } = useAppContext()
    const { clients, reportOption } = mainData.report
    const { firstReferenceId } = reportOption

    useEffect(()=> {
    }, [clients])
    
    let datas = clients ? clients[0]?.values : []

    return (
       <>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td >№</td>
                        <td>ТМБ</td>
                        <td>улч. бир.</td>
                        <td>уртача нарх</td>
                        <td>Колдик сон</td>
                        <td>Колдик сумма</td>
                        <td>Кирим сон</td>
                        <td>Кирим сумма</td>
                        <td>Чиким сон</td>
                        <td>Чиким сумма</td>
                        <td>Колдик сон</td>
                        <td>Колдик сумма</td>
                    </tr>
                </thead>
                {
                    datas && datas.length &&
                    datas
                    .filter((item:any) => {
                        if (firstReferenceId) return item.sectionId == firstReferenceId
                        return true
                    })
                    .map((element: any, key: number) => {
                        if (!element?.items.length) return <></>
                        return <ClientItem 
                            key={key}
                            item={element}
                            section={element.section}
                        />
                    })
                }
                
            </table>
       </>
    )
} 

