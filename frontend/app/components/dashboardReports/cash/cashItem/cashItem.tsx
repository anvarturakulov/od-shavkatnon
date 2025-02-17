'use client'
import { CashItemProps } from './cashItem.props';
import styles from './cashItem.module.css';
import { numberValue } from '@/app/service/common/converters';

export const CashItem = ({className, item, ...props }: CashItemProps) :JSX.Element => {
    
    return (
       <>
        <tbody>
            <tr>
              <td className={styles.title}>{item?.section}</td>
              <td>{numberValue(item?.startBalans)}</td>
              <td>{numberValue(item?.sale)}</td>
              <td>{numberValue(item?.moveIncome)}</td>
              <td >{numberValue(item?.allIncome)}</td>
              <td>{numberValue(item?.charges)}</td>
              <td>{numberValue(item?.forPartner)}</td>
              <td>{numberValue(item?.moveOut)}</td>
              <td>{numberValue(item?.forFounder)}</td>
              <td>{numberValue(item?.allOut)}</td>
              <td>{numberValue(item?.endBalans)}</td>
            </tr>
        </tbody>
      </>
    )
} 