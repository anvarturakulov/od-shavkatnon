'use client'
import { SectionProps } from './section.props';
import styles from './section.module.css';
import { SectionItem } from './sectionItem/sectionItem';
import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { useState } from 'react';

export const Section = ({className, data, sectionType, currentSection, ...props }: SectionProps) :JSX.Element => {
    let title 
    if (sectionType == 'delivery') title = 'ЮК ЕТКАЗУВЧИЛАР'
    if (sectionType == 'filial') title = 'ЦЕХЛАР'
    if (sectionType == 'buxgalter') title = 'БУХГАЛТЕРЛАР'

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
                            if (sectionType == 'delivery') return item?.delivery
                            if (sectionType == 'filial') return item?.filial
                            if (sectionType == 'buxgalter') return item?.buxgalter
                        })
                        .filter((item: ReferenceModel) => {
                            if (currentSection) return item._id == currentSection
                            else return true
                        })
                        .map((item: ReferenceModel, key: number) => {
                            return <SectionItem key={key} currentId= {item._id} data={data} title={item.name} sectionType = {sectionType}/>
                        })
                    }
                </div>
            }
             
            
       </>
    )
} 