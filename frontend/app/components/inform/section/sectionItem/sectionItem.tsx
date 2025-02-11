'use client'
import { SectionItemProps } from './sectionItem.props';
import styles from './sectionItem.module.css';
import cn from 'classnames';
import { Htag } from '@/app/components';
import { numberValue } from '@/app/service/common/converters';

export const SectionItem = ({className, item, sectionType, ...props }: SectionItemProps) :JSX.Element => {
    
    return (
       <>
          <div className={styles.item}>
            <Htag tag='h1'>{item?.section}</Htag>
            {
                ( sectionType != 'buxgalter' && sectionType != 'founder')
                &&
                <>
                    <Htag tag='h2' className={styles.h2}>Сон буйича</Htag>
                    <div className={cn(styles.row, styles.rowCount)}>
                        <div className={styles.title}>Кун бош. колдик</div>
                        <div>{numberValue(item?.startBalansCountNon)}</div>
                        <div className={styles.blueValues}>{numberValue(item?.startBalansCountBux)}</div>
                    </div>

                    <div className={cn(styles.row, styles.rowCount)}>
                        <div className={styles.title}>Ишл. чик. кирим</div>
                        <div>{numberValue(item?.prodCountNon)}</div>
                        <div className={styles.blueValues}>{numberValue(item?.prodCountBux)}</div>
                    </div>
                    
                    <div className={cn(styles.row, styles.rowCount)}>
                        <div className={styles.title}>Ички силж. кирим</div>
                        <div>{numberValue(item?.moveIncomeCountNon)}</div>
                        <div className={styles.blueValues}>{numberValue(item?.moveIncomeCountBux)}</div>
                    </div>
                    
                    <div className={cn(styles.row, styles.rowCount)}>
                        <div className={styles.title}>Сотилган нон</div>
                        <div>
                            {numberValue(item?.saleCountNon)}
                            <span>
                                &nbsp;({numberValue(item?.maydaSavdoCount)})
                            </span> 
                        </div>
                        <div className={styles.blueValues}>
                            {numberValue(item?.saleCountBux)}
                            <span>
                                &nbsp;({numberValue(item?.maydaSavdoCountBux)})
                            </span> 
                        </div>
                    </div>
                    <div className={cn(styles.row, styles.rowCount)}>
                        <div className={styles.title}>Брак(истем.) нон</div>
                        <div>{numberValue(item?.brakCountNon)}</div>
                        <div className={styles.blueValues}>{numberValue(item?.brakCountBux)}</div>
                    </div>
                    <div className={cn(styles.row, styles.rowCount)}>
                        <div className={styles.title}>Ички сил. чиким</div>
                        <div>{numberValue(item?.moveOutNon)}</div>
                        <div className={styles.blueValues}>{numberValue(item?.moveOutBux)}</div>
                    </div>

                    <div className={cn(styles.row, styles.rowCount)}>
                        <div className={styles.title}>Зимм. колдик нон</div>
                        <div>{numberValue(item?.endBalansCountNon)}</div>
                        <div className={styles.blueValues}>{numberValue(item?.endBalansCountBux)}</div>
                    </div>
                </>
            }

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
      </>
    )
} 