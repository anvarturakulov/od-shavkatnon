'use client'
import { OborotkaItemProps } from './oborotkaItem.props';
import styles from './oborotkaItem.module.css';
import { numberValue } from '@/app/service/common/converters';
import { totalByKey } from '@/app/components/reports/dashboardReports/inform';
import { getAnalitic } from '@/app/service/reports/getAnalitic';
import { useAppContext } from '@/app/context/app.context';
import { DEBETKREDIT } from '@/app/interfaces/report.interface';

export const OborotkaItem = ({className, item, ...props }: OborotkaItemProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    
    let PDKOL = totalByKey('PDKOL', item?.items)
    let PKKOL = totalByKey('PKKOL', item?.items);
    let PDSUM = totalByKey('PDSUM', item?.items)
    let PKSUM = totalByKey('PKSUM', item?.items)
    let TDKOL = totalByKey('TDKOL', item?.items)
    let TDSUM = totalByKey('TDSUM', item?.items)
    let TKKOL = totalByKey('TKKOL', item?.items)
    let TKSUM = totalByKey('TKSUM', item?.items)

    let saldoStart = item?.PDSUM-item?.PKSUM
    let saldoEnd = item?.PDSUM-item?.PKSUM+item?.TDSUM-item?.TKSUM
    return (
       <>
        <thead>
          <tr className={styles.sectionName}>
            <td></td>
            <td className={styles.title}>{item?.name}</td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            {/* <td className={styles.totalTd}>{numberValue(saldoStart>0 ? saldoStart : 0)}</td>
            <td className={styles.totalTd}>{numberValue(saldoStart<=0 ?(-1)*saldoStart:0)}</td>
            <td className={styles.totalTd}>{numberValue(item?.TDSUM)}</td>
            <td className={styles.totalTd}>{numberValue(item?.TDKOL)}</td>
            <td className={styles.totalTd}>{numberValue(item?.TKSUM)}</td>
            <td className={styles.totalTd}>{numberValue(item?.TKKOL)}</td>
            <td className={styles.totalTd}>{numberValue(saldoEnd > 0 ? saldoEnd : 0)}</td>
            <td className={styles.totalTd}>{numberValue(saldoEnd <= 0 ? (-1)*saldoEnd: 0)}</td> */}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
            {
                item?.subItems &&
                item?.subItems.length &&
                item?.subItems.map((element:any, key:number) => {
                    let saldoStart = element?.subPDSUM-element?.subPKSUM
                    let saldoEnd = element?.subPDSUM-element?.subPKSUM+element?.subTDSUM-element?.subTKSUM
                    return (
                        <tr key={key}>
                          <td className={styles.number}>{key+1}</td>
                          <td id='itemName' className={styles.title}>{element?.name}</td>

                          <td>{numberValue(saldoStart>0 ? saldoStart : 0)}</td>
                          <td>{numberValue(saldoStart<=0 ?(-1)*saldoStart:0)}</td>
                          <td 
                            onDoubleClick={() => getAnalitic(setMainData, mainData, item?.sectionId, element?.sectionId, DEBETKREDIT.DEBET)}
                            >
                              {numberValue(element?.subTDSUM)}
                          </td>
                          <td 
                            onDoubleClick={() => getAnalitic(setMainData, mainData, item?.sectionId, element?.sectionId, DEBETKREDIT.DEBET)}
                            >
                              {numberValue(element?.subTDKOL)}
                          </td>
                          <td
                            onDoubleClick={() => getAnalitic(setMainData, mainData, item?.sectionId, element?.sectionId, DEBETKREDIT.KREDIT)}
                            >
                              {numberValue(element?.subTKSUM)}
                          </td>
                          <td
                            onDoubleClick={() => getAnalitic(setMainData, mainData, item?.sectionId, element?.sectionId, DEBETKREDIT.KREDIT)}
                            >
                              {numberValue(element?.subTKKOL)}
                          </td>
                          <td>{numberValue(saldoEnd > 0 ? saldoEnd : 0)}</td>
                          <td>{numberValue(saldoEnd <= 0 ? (-1)*saldoEnd: 0)}</td>
                        </tr>
                    )
                })

            }
            
        </tbody>
        <thead>
          <tr className={styles.total}>
              <td></td>
              <td>Жами</td>

              <td className={styles.totalTd}>{numberValue(item?.PDSUM-item?.PKSUM)}</td>
              <td className={styles.totalTd}>{numberValue(item?.PDKOL-item?.PKKOL)}</td>
              <td className={styles.totalTd}>{numberValue(item?.TDSUM)}</td>
              <td className={styles.totalTd}>{numberValue(item?.TDKOL)}</td>
              <td className={styles.totalTd}>{numberValue(item?.TKSUM)}</td>
              <td className={styles.totalTd}>{numberValue(item?.TKKOL)}</td>
              <td className={styles.totalTd}>{numberValue(item?.PDSUM-item?.PKSUM+item?.TDSUM-item?.TKSUM)}</td>
              <td className={styles.totalTd}>{numberValue(item?.PDKOL-item?.PKKOL+item?.TDKOL-item?.TKKOL)}</td>

              </tr>
      </thead>
      </>
    )
} 
// XPathExpression filter for(let first of second) {third}