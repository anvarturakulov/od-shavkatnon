'use client'
import styles from './personalItem.module.css';
import { numberValue } from '@/app/service/common/converters';
import { PersonalItemProps } from './personalItem.props';
import { useState } from 'react';
import cn from 'classnames';

export const secondsToDateString = (seconds: number): String => {
  return new Date(+seconds).toLocaleString()
}


export const PersonalItem = ({className, item, ...props }: PersonalItemProps) :JSX.Element => {

  const [showInners, setShowInners] = useState<boolean>(false)
  const plus = showInners ? '-':'+';
  return (
      <>
      <thead>
      <tr className={cn(styles.trRowMain, {[styles.opened]: showInners})} >
          <td 
              className={styles.plus} 
              onClick={() => setShowInners(showInners => !showInners)
              }>
                {plus}
          </td>
          <td className={styles.title}>{item?.name}</td>
          <td className={styles.title}></td>
          <td className={styles.title}></td>
          <td className={styles.title}></td>
          <td className={styles.totalTdKol}>{numberValue((-1)*item?.POSUM)}</td>
          <td className={styles.totalTdKol}>{numberValue(item?.TKSUM)}</td>
          <td className={styles.totalTdKol}>{numberValue(item?.TDSUM)}</td>
          <td className={styles.totalTdKol}>{numberValue((-1)*item?.POSUM+item?.TKSUM-item?.TDSUM)}</td>
        </tr>
      </thead>
      <tbody className={styles.tbody}>
          {
              item?.subItems &&
              showInners &&
              item?.subItems.length &&
              item?.subItems.map((element:any, key:number) => {
                  return (
                    <tr key={key}>
                      <td className={styles.number}>{key+1}</td>
                      <td></td>
                      <td>{secondsToDateString(element?.date)}</td>
                      <td>{element?.section}</td>
                      <td>{element?.comment}</td>
                      <td></td>
                      <td>{numberValue(element?.TKSUM)}</td>
                      <td>{numberValue(element?.TDSUM)}</td>
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