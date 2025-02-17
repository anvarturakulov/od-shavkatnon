'use client'
import { MatOborotItemProps } from './matOborotItem.props';
import styles from './matOborotItem.module.css';
import { numberValue } from '@/app/service/common/converters';
import { totalByKey } from '@/app/components/dashboardReports/inform';

export const MatOborotItem = ({className, item, section, ...props }: MatOborotItemProps) :JSX.Element => {
    let PDKOL = totalByKey('PDKOL', item?.items)
    let PKKOL = totalByKey('PKKOL', item?.items);
    let PDSUM = totalByKey('PDSUM', item?.items)
    let PKSUM = totalByKey('PKSUM', item?.items)
    let TDKOL = totalByKey('TDKOL', item?.items)
    let TDSUM = totalByKey('TDSUM', item?.items)
    let TKKOL = totalByKey('TKKOL', item?.items)
    let TKSUM = totalByKey('TKSUM', item?.items)

    return (
       <>
        <thead>
          <tr className={styles.sectionName}>
            <td></td>
            <td>{section}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td> 
          </tr>
        </thead>
        <tbody className={styles.tbody}>
            {
                item?.items &&
                item?.items.length &&
                item?.items.map((element:any, key:number) => {
                    return (
                        <tr key={key}>
                          <td className={styles.number}>{key+1}</td>
                          <td id='itemName' className={styles.title}>{element?.name}</td>
                          <td>--</td>
                          <td>--</td>
                          <td>{numberValue(element?.PDKOL-element?.PKKOL)}</td>
                          <td>{numberValue(element?.PDSUM-element?.PKSUM)}</td>
                          <td>{numberValue(element?.TDKOL)}</td>
                          <td>{numberValue(element?.TDSUM)}</td>
                          <td>{numberValue(element?.TKKOL)}</td>
                          <td>{numberValue(element?.TKSUM)}</td>
                          <td>{numberValue(element?.PDKOL-element?.PKKOL+element?.TDKOL-element?.TKKOL)}</td>
                          <td>{numberValue(element?.PDSUM-element?.PKSUM+element?.TDSUM-element?.TKSUM)}</td>
                        </tr>
                    )
                })

            }
            
        </tbody>
        <thead>
          <tr className={styles.total}>
              <td></td>
              <td>Жами</td>
              <td></td>
              <td></td>
              <td className={styles.totalTd}>{numberValue(PDKOL-PKKOL)}</td>
              <td className={styles.totalTd}>{numberValue(PDSUM-PKSUM)}</td>
              <td className={styles.totalTd}>{numberValue(TDKOL)}</td>
              <td className={styles.totalTd}>{numberValue(TDSUM)}</td>
              <td className={styles.totalTd}>{numberValue(TKKOL)}</td>
              <td className={styles.totalTd}>{numberValue(TKSUM)}</td>
              <td className={styles.totalTd}>{numberValue(PDKOL-PKKOL+TDKOL-TKKOL)}</td>
              <td className={styles.totalTd}>{numberValue(PDSUM-PKSUM+TDSUM-TKSUM)}</td>

              </tr>
      </thead>
      </>
    )
} 