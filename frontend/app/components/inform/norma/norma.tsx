'use client'
import { NormaProps } from './norma.props';
import styles from './norma.module.css';
import { NormaItem } from './normaItem/normaItem';
import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { useEffect, useState } from 'react';

export const Norma = ({className, data, currentSection, ...props }: NormaProps) :JSX.Element => {
    let title = 'ХОМ АШЁЛАРНИНГ НОРМА БУЙИЧА ЧИКИМИ' 
    
    useEffect(()=> {
    }, [data])
    
    let datas = data ? data.filter((item: any) => item?.reportType == 'NORMA')[0]?.values : []

    return (
       <>
            <div className={styles.title}>
                {title}
            </div>

            <div className={styles.itemsBox}>
                {
                    datas && datas.length &&
                    datas
                    .map((element: any, key: number) => {
                        return <NormaItem 
                            key={key}
                            item={element}
                        />
                    })
                }
            </div>

             
       </>
    )
} 