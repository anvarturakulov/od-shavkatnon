'use client'
import { OborotkaItemProps } from './oborotkaItem.props';
import styles from './oborotkaItem.module.css';
import { numberValue } from '@/app/service/common/converters';
import { totalByKey } from '@/app/components/reports/dashboardReports/inform';
import { getAnalitic } from '@/app/service/reports/getAnalitic';
import { useAppContext } from '@/app/context/app.context';
import { DEBETKREDIT } from '@/app/interfaces/report.interface';
import { useState } from 'react';

export const OborotkaItem = ({className, item, ...props }: OborotkaItemProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const [showInners, setShowInners] = useState<boolean>(false)
    const plus = showInners ? '-':'+';
    
    // let PDKOL = totalByKey('PDKOL', item?.items)
    // let PKKOL = totalByKey('PKKOL', item?.items);
    // let PDSUM = totalByKey('PDSUM', item?.items)
    // let PKSUM = totalByKey('PKSUM', item?.items)
    // let TDKOL = totalByKey('TDKOL', item?.items)
    // let TDSUM = totalByKey('TDSUM', item?.items)
    // let TKKOL = totalByKey('TKKOL', item?.items)
    // let TKSUM = totalByKey('TKSUM', item?.items)

    // let saldoStart = item?.PDSUM-item?.PKSUM
    // let saldoEnd = item?.PDSUM-item?.PKSUM+item?.TDSUM-item?.TKSUM

    let saldoStart = item?.POSUM
    let saldoEnd = item?.KOSUM
                    
    return (
       <>
        <thead>
          <tr className={styles.sectionName}>
            <td 
                className={styles.plus} 
                onClick={() => setShowInners(showInners => !showInners)
                }>
                  {plus}
            </td>
            <td className={styles.title}>{item?.name}</td>
            <td className={styles.totalTd}>{numberValue(saldoStart>0 ? saldoStart : 0)}</td>
            <td className={styles.totalTd}>{numberValue(saldoStart<=0 ?(-1)*saldoStart:0)}</td>
            <td className={styles.totalTd}>{numberValue(item?.TDSUM)}</td>
            <td className={styles.totalTd}>{numberValue(item?.TKSUM)}</td>
            <td>{numberValue(saldoEnd > 0 ? saldoEnd : 0)}</td>
            <td>{numberValue(saldoEnd <= 0 ? (-1)*saldoEnd: 0)}</td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
            {
                item?.subItems &&
                showInners &&
                item?.subItems.length &&
                item?.subItems.map((element:any, key:number) => {
                    return (
                        <tr key={key} className={styles.innerItems}>
                          <td className={styles.number}>{key+1}</td>
                          <td id='itemName' className={styles.title}>{element?.name}</td>

                          <td>{numberValue(element?.subPOSUM > 0 ? element?.subPOSUM : 0)}</td>
                          <td>{numberValue(element?.subPOSUM <= 0 ? (-1)*element?.subPOSUM : 0)}</td>
                          <td 
                            onDoubleClick={() => getAnalitic(setMainData, mainData, item?.sectionId, element?.sectionId, DEBETKREDIT.DEBET)}
                            >
                              {numberValue(element?.subTDSUM)}
                          </td>
                          
                          <td
                            onDoubleClick={() => getAnalitic(setMainData, mainData, item?.sectionId, element?.sectionId, DEBETKREDIT.KREDIT)}
                            >
                              {numberValue(element?.subTKSUM)}
                          </td>
                          
                          <td>{numberValue(element?.subKOSUM > 0 ? element?.subKOSUM : 0)}</td>
                          <td>{numberValue(element?.subKOSUM <= 0 ? (-1)*element?.subKOSUM : 0)}</td>
                        </tr>
                    )
                })

            }
            
        </tbody>
        
      </>
    )
} 
// XPathExpression filter for(let first of second) {third}