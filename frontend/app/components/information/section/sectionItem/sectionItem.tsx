'use client'
import { SectionItemProps } from './sectionItem.props';
import styles from './sectionItem.module.css';
import cn from 'classnames';
import { Htag } from '@/app/components';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { query } from '@/app/service/reports/querys/query';
import { numberValue } from '@/app/service/common/converters';
import { queryKor } from '@/app/service/reports/querys/queryKor';

export const SectionItem = ({className, data, currentId, title, sectionType,  ...props }: SectionItemProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext()
    

    let idForBuxanka = '65e7048b5c54490bbc335ca2';

    const PDKOL = query(Schet.S28, TypeQuery.PDKOL, null, mainData, true, currentId, true);
    const PDKOLbux = query(Schet.S28, TypeQuery.PDKOL, idForBuxanka, mainData, true, currentId, true);
    
    const PKKOL = query(Schet.S28, TypeQuery.PKKOL, null, mainData, true, currentId, true);
    const PKKOLbux = query(Schet.S28, TypeQuery.PKKOL, idForBuxanka, mainData, true, currentId, true);

    const OBKOLD2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, currentId, undefined, mainData, true);
    const OBKOLD2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, currentId, idForBuxanka, mainData, true);
    
    const OBKOLD2820 = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, currentId, undefined, mainData, true);;
    const OBKOLD2820bux = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, currentId, idForBuxanka, mainData, true);;
    
    const OBKOLK2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, currentId, undefined, mainData, true);
    const OBKOLK2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, currentId, idForBuxanka, mainData, true);
    
    const OBKOLK2028 = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, currentId, undefined, mainData, true);;
    const OBKOLK2028bux = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, currentId, idForBuxanka, mainData, true);;

    const OBKOLK4028 = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, currentId, undefined, mainData, true);;
    const OBKOLK4028bux = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, currentId, idForBuxanka, mainData, true);;
   
    const TDKOL = query(Schet.S28, TypeQuery.TDKOL, null, mainData, true, currentId, true);
    const TDKOLbux = query(Schet.S28, TypeQuery.TDKOL, idForBuxanka, mainData, true, currentId, true);
    
    const TKKOL = query(Schet.S28, TypeQuery.TKKOL, null, mainData, true, currentId, true);
    const TKKOLbux = query(Schet.S28, TypeQuery.TKKOL, idForBuxanka, mainData, true, currentId, true);

    const PDSUM = query(Schet.S50, TypeQuery.PDSUM, null, mainData, true, currentId, true);
    const PKSUM = query(Schet.S50, TypeQuery.PKSUM, null, mainData, true, currentId, true);

    const TDSUM = query(Schet.S50, TypeQuery.TDSUM, null, mainData, true, currentId, true);
    const TKSUM = query(Schet.S50, TypeQuery.TKSUM, null, mainData, true, currentId, true);

    const MOVEINN = queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, currentId, undefined, mainData, true);
    const MOVEOUT = queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, currentId, undefined, mainData, true);
    
    
    return (
       <>
          <div className={styles.item}>
            <Htag tag='h1'>{title}</Htag>
            
            {
                sectionType != 'buxgalter'
                &&
                <>
                    <Htag tag='h2' className={styles.h2}>Сон буйича</Htag>
                    <div className={styles.row}>
                        <div className={styles.title}>Кун бошига колдик нони</div>
                        <div className={styles.value}>
                            {numberValue(PDKOL-PKKOL-(PDKOLbux-PKKOLbux))}
                            <span> ({numberValue(PDKOLbux-PKKOLbux)})</span>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.title}>Ишлаб. чик. кирим</div>
                        <div className={styles.value}>
                            {numberValue(OBKOLD2820-OBKOLD2820bux)}
                            <span> ({numberValue(OBKOLD2820bux)})</span>
                        </div>
                    </div>
                    
                    <div className={styles.row}>
                        <div className={styles.title}>Ички силжиш. кирим</div>
                        <div className={styles.value}>
                            {numberValue(OBKOLD2828-OBKOLD2828bux)}
                            <span> ({numberValue(OBKOLD2828bux)})</span>
                        </div>
                    </div>
                    
                    <div className={styles.row}>
                        <div className={styles.title}>Сотилган нон</div>
                        <div className={styles.value}>
                            {numberValue(OBKOLK4028-OBKOLK4028bux)}
                            <span> ({numberValue(OBKOLK4028bux)})</span>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.title}>Брак(истем.) нон</div>
                        <div className={styles.value}>
                            {numberValue(OBKOLK2028-OBKOLK2028bux)}
                            <span> ({numberValue(OBKOLK2028bux)})</span>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.title}>Ички сил. чиким</div>
                        <div className={styles.value}>
                            {numberValue(OBKOLK2828-OBKOLK2828bux)}
                            <span> ({numberValue(OBKOLK2828bux)})</span>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.title}>Зиммасидаги колдик нон</div>
                        <div className={styles.value}>
                            {numberValue(PDKOL - PKKOL + TDKOL - TKKOL - (PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux))}
                            <span> ({numberValue(PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux)})</span>
                        </div>
                    </div>
                </>
            }

            <Htag tag='h2' className={cn(styles.h2, styles.bottomTitle)}>Пул буйича</Htag>
            <div className={styles.row}>
                <div className={styles.title}>Бошлангич карзи</div>
                <div className={styles.value}>{numberValue(PDSUM-PKSUM)}</div>
            </div>
            
            <div className={styles.row}>
                <div className={styles.title}>Пул кирим (махс. сот)</div>
                <div className={styles.value}>{numberValue(TDSUM-MOVEINN)}</div>
            </div>

            <div className={styles.row}>
                <div className={styles.title}>Пул силжиш кирим</div>
                <div className={styles.value}>{numberValue(MOVEINN)}</div>
            </div>

            <div className={styles.row}>
                <div className={styles.title}>Пул силжиш чиким</div>
                <div className={styles.value}>{numberValue(MOVEOUT)}</div>
            </div>
           
            <div className={styles.row}>
                <div className={styles.title}>Пул харажати</div>
                <div className={styles.value}>{numberValue(TKSUM-MOVEOUT)}</div>
            </div>
            
            <div className={styles.row}>
                <div className={styles.title}>Охирги карзи</div>
                <div className={styles.value}>{numberValue(PDSUM-PKSUM+TDSUM-TKSUM)}</div>
            </div>
          </div>
      </>
    )
} 