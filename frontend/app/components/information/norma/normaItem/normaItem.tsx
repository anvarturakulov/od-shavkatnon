'use client'
import { NormaItemProps } from './normaItem.props';
import styles from './normaItem.module.css';
import { Htag } from '@/app/components';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { numberValue } from '@/app/service/common/converters';
import cn from 'classnames';
import { queryKor } from '@/app/service/reports/querys/queryKor';
import { ReferenceModel, TypeTMZ } from '@/app/interfaces/reference.interface';

export const NormaItem = ({className, data, currentId, title,  ...props }: NormaItemProps) :JSX.Element => {
    
    const { mainData } = useAppContext()

    const idBuxankaSection = '6604086a3e7f32e728cd6a9d';
    const idZagatovka27 = '659ce9a8523a48fdeb6ad92f';
    const idZagatovka26 = '659cf66e523a48fdeb6ada1a';
    const idZagatovka = currentId == idBuxankaSection ? idZagatovka26 : idZagatovka27;
    const countHamirs = queryKor(Schet.S20, Schet.S21, TypeQuery.OKK, currentId, idZagatovka, mainData, true);
    
    return (
       <>
          <div className={styles.item}>
            <Htag tag='h1' className={styles.topTitle}>
                <div>{title}</div>
                <div className={cn(styles.topTitleCount, styles.blue, {
                    [styles.red]: !countHamirs,
                })}>{countHamirs ? `${countHamirs} та хамир` : '**?**' }</div>
            </Htag>
            <div className={styles.row}>
                <div className={cn(styles.title, styles.topRow)}>Ном</div>
                <div className={cn(styles.title, styles.topRow, styles.value)}>Хакикат</div>
                <div className={cn(styles.title, styles.topRow, styles.value)}>Норма</div>
                <div className={cn(styles.title, styles.topRow, styles.value)}>Фарк</div>
            </div>
            {/* <Htag tag='h2' className={styles.h2}>Сон буйича</Htag> */}
            {
                data &&
                data.length &&
                data
                .filter((item: ReferenceModel) => {
                    return ( item.typeTMZ == TypeTMZ.MATERIAL)
                })
                .map((item: ReferenceModel, key:number) => {
                    const rasxod = queryKor(Schet.S20, Schet.S10, TypeQuery.OKK, currentId, item._id, mainData, true);
                    const referenceNorma = item.norma;
                    const norma = referenceNorma ? referenceNorma * countHamirs: 0;
                    const farq = norma - rasxod;  
                    
                    if (rasxod == 0) return <></>
                    return (
                        <div className={styles.row} key={key}>
                            <div className={styles.title}>{item.name}</div>
                            <div className={styles.value}>{numberValue(rasxod)}</div>
                            <div className={cn(styles.value, styles.green)}>{numberValue(norma)}</div>
                            <div className={cn(styles.value, {
                                [styles.red]: farq < 0,
                                [styles.blue]: farq > 0
                            })}>{numberValue(farq)}</div>
                        </div>
                    )
                })

            }
            
            
          </div>
      </>
    )
} 