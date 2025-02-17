'use client'
import { FoydaItemProps } from './foydaItem.props';
import styles from './foydaItem.module.css';
import { numberValue } from '@/app/service/common/converters';

export const FoydaItem = ({className, item, ...props }: FoydaItemProps) :JSX.Element => {
    return (
       <>
        <tbody>
            <tr>
              <td className={styles.title}>{item?.section}</td>
              <td>
                {numberValue(item?.productionCountAll)} <br/>
                <span className={styles.span}>({numberValue(item?.productionCountBux)})</span>
              </td>
              <td>
                {numberValue(item?.productionDocsCountAll)}
                <span className={styles.span}>({numberValue(item?.productionDocsCountBux)})</span>
              </td>
              <td>
                {numberValue(item?.saleCountWithOutMoveAll)}<br/>
                <span className={styles.span}>({numberValue(item?.saleCountWithOutMoveBux)})</span>
              </td>
              <td>
                {numberValue(item?.countDeleviryAll)}<br/>
                <span className={styles.span}>({numberValue(item?.countDeleviryBux)})</span>
              </td>
              <td>
                {numberValue(item?.saleWithMoveAll)}<br/>
                <span className={styles.span}>({numberValue(item?.saleWithMoveBux)})</span>
              </td>
              <td>{numberValue(item?.zagatovka)}</td>
              <td >{numberValue(item?.materials)}</td>
              <td>{numberValue(item?.zp)}</td>
              <td>{numberValue(item?.addingZp)}</td>
              <td>{numberValue(item?.services)}</td>
              <td>{numberValue(item?.currentPayment)}</td>
              <td>{numberValue(item?.addingCurrentPayment)}</td>
              <td>{numberValue(item?.longPayment)}</td>
              <td>{numberValue(item?.addingLongeCharge)}</td>
              <td>{numberValue(item?.realEarning)}</td>
              <td>{numberValue(item?.koefCurrentEarningToOneProduct)}</td>
              <td>{numberValue(item?.currentEarning)}</td>
            </tr>
        </tbody>
      </>
    )
} 