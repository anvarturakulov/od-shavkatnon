'use client'
import { SkladItemProps } from './skladItem.props';
import styles from './skladItem.module.css';
import { Htag } from '@/app/components';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { query } from '@/app/service/reports/querys/query';
import { numberValue } from '@/app/service/common/converters';
import { getListSecondSubconts } from '@/app/service/reports/getListSecondSubconts';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { UserRoles } from '@/app/interfaces/general.interface';

export const SkladItem = ({className, item, ...props }: SkladItemProps) :JSX.Element => {
    
    // if (currentId) {
    //     listSecondSubconts = getListSecondSubconts(mainData.reportOption.entrys, [Schet.S10, Schet.S21, Schet.S28], currentId);
    // }
    
    return (
       <>
          <div className={styles.item}>
            <Htag tag='h1'>{item?.section}</Htag>
            <Htag tag='h2' className={styles.h2}>Сон буйича</Htag>
            {
                item?.items &&
                item?.items.length &&
                item?.items.map((element:any, key:number) => {
                    const value = element?.value
                    const price = element?.price
                    const valueSum = element?.valueSum
                    const bag = element?.bag

                    if (value == 0) return <></>
                    return (
                        <div className={styles.row} key={key}>
                            <div className={styles.title}>{element?.name}</div>
                            <div className={styles.value}>{numberValue(+value)}</div>
                            <div className={styles.value}><span>{bag ? `(${bag})`: ''}</span></div>
                            <div className={styles.value}>{numberValue(+price)}</div>
                            <div className={styles.value}>{numberValue(+valueSum)}</div>
                        </div>
                    )
                })

            }
            
            
          </div>
      </>
    )
} 