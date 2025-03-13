'use client'

import styles from './oborotka.module.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import { PersonalProps } from './personal.props';
import { PersonalItem } from './personalItem/personalItem';


export const Personal = ({className, ...props }: PersonalProps) :JSX.Element => {
    const { setMainData, mainData } = useAppContext()
    const { oborotka, reportOption } = mainData.report
    const { firstReferenceId } = reportOption

    let datas = oborotka ? oborotka?.values : []

    return (
       <>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <td >№</td>
                        <td className={styles.titleName}>ФИШ</td>
                        <td className={styles.titleValue}>сана</td>
                        <td className={styles.titleValue}>цех</td>
                        <td className={styles.titleValue}>изох</td>
                        <td className={styles.titleValue}>Колдик сумма</td>
                        <td className={styles.titleValue}>Хисобланди</td>
                        <td className={styles.titleValue}>Туланди</td>
                        <td className={styles.titleValue}>Колдик сумма</td>
                    </tr>
                </thead>
                {
                    datas && datas.length &&
                    datas
                    .map((element: any, key: number) => {
                        return <PersonalItem 
                            key={key}
                            item={element}
                        />
                    })
                }
                
            </table>
       </>
    )
} 

