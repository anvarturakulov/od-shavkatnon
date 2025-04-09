'use client'
import { OborotkaProps } from './oborotka.props';
import { OborotkaItem } from './oborotkaItem/oborotkaItem';
import styles from './oborotka.module.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';

export const Oborotka = ({className, ...props }: OborotkaProps) :JSX.Element => {
    const { setMainData, mainData } = useAppContext()
    const { oborotka, reportOption } = mainData.report
    const { firstReferenceId } = reportOption

    useEffect(()=> {
        if (oborotka) {
        }
    }, [oborotka])
    
    let datas = oborotka ? oborotka?.values : []
    // if (oborotka) {
    //     console.log('start Time Data from Backend - ', oborotka?.startTime)
    //     console.log('end Time Data from Backend - ', oborotka?.endTime)
    // }
    return (
       <>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td >№</td>
                        <td className={styles.titleName}>Номи</td>
                        <td className={styles.titleValue}>Колдик сумма +</td>
                        <td className={styles.titleValue}>Колдик сумма -</td>
                        <td className={styles.titleValue}>Дебет сумма</td>
                        <td className={styles.titleValue}>Кредит сумма</td>
                        <td className={styles.titleValue}>Колдик сумма +</td>
                        <td className={styles.titleValue}>Колдик сумма -</td>
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
                        // if (!element?.items.length) return <></>
                        // if (key == 0) console.log('show items - ', Date.now())
                        return <OborotkaItem 
                            key={key}
                            item={element}
                        />
                    })
                }
                
            </table>
       </>
    )
} 

