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

export const SkladItem = ({className, data, currentId, title, sectionType,  ...props }: SkladItemProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext()

    let startDateFromStorage: string | undefined | null, endDateFromStorage : string | undefined | null

    if (typeof window !== 'undefined') {
      startDateFromStorage = localStorage.getItem('dateStartToInterval');
      endDateFromStorage = localStorage.getItem('dateEndToInterval');
    }
    let listSecondSubconts
    if (currentId) {
        listSecondSubconts = getListSecondSubconts(mainData.reportOption.entrys, [Schet.S10, Schet.S21, Schet.S28], currentId);
    }
    let schetList = [Schet.S10,Schet.S21]
    
    if (mainData.user?.role == UserRoles.HAMIRCHI) schetList = [Schet.S21]

    return (
       <>
          <div className={styles.item}>
            <Htag tag='h1'>{title}</Htag>
            <Htag tag='h2' className={styles.h2}>Сон буйича</Htag>
            {
                listSecondSubconts &&
                listSecondSubconts.length &&
                listSecondSubconts.map((item: string, key:number) => {
                    const PDKOL = query(schetList, TypeQuery.PDKOL, item, mainData, true, currentId, true);
                    const PKKOL = query(schetList, TypeQuery.PKKOL, item, mainData, true, currentId, true);
                    const TDKOL = query(schetList, TypeQuery.TDKOL, item, mainData, true, currentId, true);
                    const TKKOL = query(schetList, TypeQuery.TKKOL, item, mainData, true, currentId, true);
                    const value = PDKOL - PKKOL + TDKOL - TKKOL
                    if (value == 0) return <></>
                    return (
                        <div className={styles.row} key={key}>
                            <div className={styles.title}>{getPropertySubconto(data, item).name}</div>
                            <div className={styles.value}>{numberValue(+value)}</div>
                        </div>
                    )
                })

            }
            
            
          </div>
      </>
    )
} 