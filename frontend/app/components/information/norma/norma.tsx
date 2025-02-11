'use client'
import { NormaProps } from './norma.props';
import styles from './norma.module.css';
import { NormaItem } from './normaItem/normaItem';
import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { useState } from 'react';

export const Norma = ({className, data, currentSection, ...props }: NormaProps) :JSX.Element => {
    let title = 'ХОМ АШЁЛАРНИНГ НОРМА БУЙИЧА ЧИКИМИ' 
    let [show, setShow] = useState<boolean>(false); 

    return (
       <>
            <div className={styles.title}>
                {title}
                <button 
                    className={styles.button}
                    onClick={()=> setShow(value => !value)}>
                        OK
                </button>
            </div>
            {
                show &&
                <div className={styles.itemsBox}>
                    {
                        data && data.length > 0 &&
                        data.filter((item: any) => {
                            return item.filial
                        })
                        .filter((item: ReferenceModel) => {
                            if (currentSection) return item._id == currentSection
                            else return true
                        })
                        .map((item: ReferenceModel, key: number) => {
                            return <NormaItem key={key} currentId= {item._id} data={data} title={item.name}/>
                        })
                    }
                </div>
            }
             
       </>
    )
} 