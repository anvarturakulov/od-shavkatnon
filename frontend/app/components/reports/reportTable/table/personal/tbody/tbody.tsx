import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto'
import styles from './tbody.module.css';
import cn from 'classnames';
import { numberValue } from '@/app/service/common/converters'
import { query } from '@/app/service/reports/querys/query'
import { useAppContext } from '@/app/context/app.context';
import { EntryItem, Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { TbodyProps } from './tbody.props';
import { queryEntrys } from '@/app/service/reports/querys/queryEntrys';
import { showMessage } from '@/app/service/common/showMessage';
import { useState } from 'react';
import { secondsToDateString } from '@/app/components/documents/doc/helpers/doc.functions';

const getSection = (data: any, item: EntryItem ): string => {
  let id: string;
  if (item.debet == Schet.S67) id = item.kreditFirstSubcontoId
  else id = item.debetFirstSubcontoId

  return getPropertySubconto(data, id).name
}

const getDebetSum = (item: EntryItem ): string => {
  if (item.debet == Schet.S67) return numberValue(item.summa)
  return ''
}

const getKreditSum = (item: EntryItem ): string => {
  if (item.kredit == Schet.S67) return numberValue(item.summa)
  return ''
}




export function TBody ({ bodyByFirstSunconto, fixedFirstSuncont, data, schet, className, ...props}:TbodyProps):JSX.Element {
  
  const { mainData, setMainData } = useAppContext();
  const [showInners, setShowInners] = useState<boolean>(false)

  const PDSUM = query(schet, TypeQuery.PDSUM, null, mainData, bodyByFirstSunconto, fixedFirstSuncont);
  const PKSUM = query(schet, TypeQuery.PKSUM, null, mainData, bodyByFirstSunconto, fixedFirstSuncont);
  const TDSUM = query(schet, TypeQuery.TDSUM, null, mainData, bodyByFirstSunconto, fixedFirstSuncont);
  const TKSUM = query(schet, TypeQuery.TKSUM, null, mainData, bodyByFirstSunconto, fixedFirstSuncont);
  const innerEntrys = queryEntrys(schet, TypeQuery.AllEntrys, null, mainData, bodyByFirstSunconto, fixedFirstSuncont);
  const plus = showInners ? '-':'+';

  if (!PDSUM &&  !PKSUM && !TDSUM && !TKSUM) return <></>


        
  return (
    <>
      {
        <tr className={cn(styles.trRowMain, {
          [styles.opened]: showInners
        })} >
          <tr>
            <td 
              className={styles.plus} 
              onClick={() => setShowInners(showInners => !showInners)
              }>
                {plus}
            </td>
            <td className={styles.comment}>{getPropertySubconto(data, fixedFirstSuncont).name}</td>
            <td className={styles.comment}>-</td>
            <td className={styles.comment}>-</td>
            <td className={styles.comment}>-</td>  
            <td className={styles.numberValue}>
                {numberValue(PKSUM-PDSUM)}
            </td>
            <td className={styles.numberValue}>
                {numberValue(TKSUM)}
            </td>
            <td className={styles.numberValue}>
                {numberValue(TDSUM)}
            </td>
            <td className={styles.numberValue}>
                {numberValue(PKSUM-PDSUM+TKSUM-TDSUM)}
            </td>
          </tr>
        </tr>
      }
      {
        showInners && innerEntrys && innerEntrys.length >0 &&
        innerEntrys
        .map((item: EntryItem, index: number) => {
          return (
            <tr className={styles.innerItems} key={index}>
              <td className={styles.plus}>{index+1}</td>
              <td className={styles.comment}>-</td>
              <td className={styles.comment}>{secondsToDateString(item.date)}</td>
              <td className={styles.comment}>{getSection(data, item)}</td>
              <td className={styles.comment}>{item.comment}</td>  
              <td className={styles.numberValue}>-</td>
              <td className={styles.numberValue}>{getKreditSum(item)}</td>
              <td className={styles.numberValue}>{getDebetSum(item)}</td>
              <td className={styles.numberValue}>-</td>
            </tr>  
          )
          
        })
      }
      
    </>
  )
}