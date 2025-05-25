'use client'
import { SectionItemProps } from './sectionItem.props';
import styles from './sectionItem.module.css';
import cn from 'classnames';
import { Htag } from '@/app/components';
import { numberValue } from '@/app/service/common/converters';

export const SectionItem = ({className, item, sectionType, ...props }: SectionItemProps) :JSX.Element => {
    const counts = (item && item.counts && item?.counts.length) ? [...item.counts] : []
    return (
       <>
          <div className={styles.item}>
            <Htag tag='h1'>{item?.section}</Htag>
            {
                ( sectionType != 'buxgalter' && sectionType != 'founder')
                && counts && counts.length &&
                counts
                .map((element: any, key: number) => {
                        return (
                            <div key = {key} className={cn(styles.box, {
                                [styles.greyRow]: (key+3) % 2 !== 0
                            })}>
                                <Htag tag='h2' className={styles.h2}>{element?.name}</Htag>
                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Кун бош. колдик</div>
                                    <div>{numberValue(element?.startBalansCountNon)}</div>
                                </div>

                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Ишл. чик. кирим</div>
                                    <div>{numberValue(element?.prodCountNon)}</div>
                                </div>
                                
                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Ички силж. кирим</div>
                                    <div>{numberValue(element?.moveIncomeCountNon)}</div>
                                </div>
                                
                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Сотилган нон</div>
                                    <div>
                                        {numberValue(element?.saleCountNon)}
                                        <span>
                                            &nbsp;({numberValue(item?.maydaSavdoCount)})
                                        </span> 
                                    </div>
                                </div>
                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Заказга берилган нон</div>
                                    <div>
                                        {numberValue(element?.saleCountOrder)}
                                         
                                    </div>
                                </div>
                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Брак(истем.) нон</div>
                                    <div>{numberValue(element?.brakCountNon)}</div>
                                </div>
                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Ички сил. чиким</div>
                                    <div>{numberValue(element?.moveOutNon)}</div>
                                </div>

                                <div className={cn(styles.row, styles.rowCount)}>
                                    <div className={styles.title}>Зимм. колдик нон</div>
                                    <div>{numberValue(element?.endBalansCountNon)}</div>
                                </div>
                            </div>
                        ) 
                            
                    })
                
            }
            <div className={styles.sumBox}>
                <Htag tag='h2' className={cn(styles.h2, styles.bottomTitle)}>Пул буйича</Htag>
                <div className={styles.row}>
                    <div className={styles.title}>Бошлангич карзи</div>
                    <div className={styles.value}>{numberValue(item?.startBalansSumma)}</div>
                </div>
                
                <div className={styles.row}>
                    <div className={styles.title}>Пул кирим (махс. сот)</div>
                    <div className={styles.value}>{numberValue(item?.incomeFromSaleSumma)}</div>
                </div>

                <div className={styles.row}>
                    <div className={styles.title}>Пул силжиш кирим</div>
                    <div className={styles.value}>{numberValue(item?.incomeFromMoveSumma)}</div>
                </div>

                <div className={styles.row}>
                    <div className={styles.title}>Пул силжиш чиким</div>
                    <div className={styles.value}>{numberValue(item?.outFromMoveSumma)}</div>
                </div>
            
                <div className={styles.row}>
                    <div className={styles.title}>Пул харажати</div>
                    <div className={styles.value}>{numberValue(item?.chargesSumma)}</div>
                </div>
                
                <div className={styles.row}>
                    <div className={styles.title}>Охирги карзи</div>
                    <div className={styles.value}>{numberValue(item?.endBalansSumma)}</div>
                </div>
            </div>
            
          </div>
      </>
    )
} 