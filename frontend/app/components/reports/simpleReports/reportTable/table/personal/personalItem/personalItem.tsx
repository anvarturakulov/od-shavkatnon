'use client'
import styles from './oborotkaItem.module.css';
import { numberValue } from '@/app/service/common/converters';
import { totalByKey } from '@/app/components/reports/dashboardReports/inform';
import { getAnalitic } from '@/app/service/reports/getAnalitic';
import { useAppContext } from '@/app/context/app.context';
import { DEBETKREDIT } from '@/app/interfaces/report.interface';
import { PersonalItemProps } from './personalItem.props';

export const PersonalItem = ({className, item, ...props }: PersonalItemProps) :JSX.Element => {
    
    return (
       <>
        <thead>
          <tr className={styles.sectionName}>
            <td>+</td>
            <td className={styles.title}>{item?.name}</td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}></td>
            <td className={styles.title}>{numberValue(item?.PDSUM-item?.PKSUM)}</td>
            <td className={styles.title}>{numberValue(item?.TDSUM)}</td>
            <td className={styles.title}>{numberValue(item?.TKSUM)}</td>
            <td className={styles.title}>{numberValue(item?.PDSUM-item?.PKSUM+item?.TDSUM-item?.TKSUM)}</td>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
            {
                item?.subItems &&
                item?.subItems.length &&
                item?.subItems.map((element:any, key:number) => {
                    return (
                      <tr key={key}>
                        <td className={styles.number}>{key+1}</td>
                        <td></td>
                        <td>{element?.date}</td>
                        <td>{element?.section}</td>
                        <td>{element?.comment}</td>
                        <td></td>
                        <td>{numberValue(element?.TDSUM)}</td>
                        <td>{numberValue(element?.TKSUM)}</td>
                        <td></td>
                      </tr>
                    )
                })
            }
            
        </tbody>
        
      </>
    )
} 
// XPathExpression filter for(let first of second) {third}