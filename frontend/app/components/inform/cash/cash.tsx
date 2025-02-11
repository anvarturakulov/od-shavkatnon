'use client'
import { CashProps } from './cash.props';
import { CashItem } from './cashItem/cashItem';
import styles from './cash.module.css';
import { useContext, useEffect, useState } from 'react';
import { numberValue } from '@/app/service/common/converters';
import { totalByKey } from '../inform';



export const Cash = ({className, data, ...props }: CashProps) :JSX.Element => {
    
    useEffect(()=> {

    }, [data])
    
    let datas = data ? data.filter((item: any) => item?.reportType == 'CASH')[0]?.values : []

    return (
       <>
            <div className={styles.title}>
                КАССА
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td>Цех</td>
                        <td>Бошлангич кол.</td>
                        <td>Савдо тушуми</td>
                        <td>Ички кирим</td>
                        <td>Жами кирим</td>
                        <td>Харажат кил.</td>
                        <td>Таъминотчига бер.</td>
                        <td>Ички чиким</td>
                        <td>Таъсисчига бер.</td>
                        <td>Жами чиким</td>
                        <td>Охирги кол.</td>
                    </tr>
                </thead>
                {   
                    datas && datas.length &&
                    datas
                    .map((element: any, key: number) => {
                        return <CashItem key={key} item={element} />
                    })
                }
                <thead>
                    <tr>
                        <td>Жами</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('startBalans', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('sale', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('moveIncome', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('allIncome', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('charges', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('forPartner', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('moveOut', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('forFounder', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('allOut', datas))}</td>
                        <td className={styles.totalTd}>{numberValue(totalByKey('endBalans', datas))}</td>
                    </tr>
                </thead>
            </table>
            
       </>
    )
} 

