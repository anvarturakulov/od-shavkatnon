'use client'
import { MatOborotProps } from './matOborot.props';
import { MatOborotItem } from './matOborotItem/matOborotItem';
import styles from './matOborot.module.css';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/context/app.context';

export const MatOborot = ({className, ...props }: MatOborotProps) :JSX.Element => {
    const { setMainData, mainData } = useAppContext()
    const { matOborot, reportOption } = mainData.report
    const { firstReferenceId } = reportOption

    useEffect(()=> {
    }, [matOborot])
    
    let datas = matOborot ? matOborot[0]?.values : []

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
                        return <MatOborotItem 
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

