'use client'
import { ProductionProps } from './production.props';
import styles from './production.module.css';
import { ProductionItem } from './productionItem/productionItem';
import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { query } from '@/app/service/reports/querys/query';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { numberValue } from '@/app/service/common/converters';
import { queryKor } from '@/app/service/reports/querys/queryKor';
import { dateNumberToString } from '@/app/service/common/converterForDates';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import useSWR from 'swr';
import { useState } from 'react';

export const Production = ({className, data, currentSection, ...props }: ProductionProps) :JSX.Element => {
    const {mainData, setMainData} = useAppContext()

    const {dateStart, dateEnd} = mainData.interval;
    let dateStartForUrl = dateStart
    let dateEndForUrl = dateEnd

    if (!dateStart && !dateEnd) {
        let now = Date.now()+18000000
        let nowInstr = dateNumberToString(now)
        dateStartForUrl = Date.parse(nowInstr)
        dateEndForUrl = Date.parse(nowInstr) + 86399999
    }
    

    const { contentName, user, showDocumentWindow } = mainData;
    const role = mainData.user?.role;
    const token = user?.access_token;

    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/hamir/byTypeForDate'+'?documentType='+contentName+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    
    const { data : hamirs, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    let idForBuxanka = '65e7048b5c54490bbc335ca2';

    const PDKOL = query(Schet.S28, TypeQuery.PDKOL, null, mainData, true, '', true);
    const PDKOLbux = query(Schet.S28, TypeQuery.PDKOL, idForBuxanka, mainData, true, '', true);
    
    const PKKOL = query(Schet.S28, TypeQuery.PKKOL, null, mainData, true, '', true);
    const PKKOLbux = query(Schet.S28, TypeQuery.PKKOL, idForBuxanka, mainData, true, '', true);

    const OBKOLD2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, '', undefined, mainData, true);
    const OBKOLD2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, '', idForBuxanka, mainData, true);
    
    const OBKOLD2820 = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, '', undefined, mainData, true);;
    const OBKOLD2820bux = queryKor(Schet.S28, Schet.S20, TypeQuery.ODK, '', idForBuxanka, mainData, true);;
    
    const OBKOLK2828 = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, '', undefined, mainData, true);
    const OBKOLK2828bux = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, '', idForBuxanka, mainData, true);
    
    const OBKOLK2028 = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, '', undefined, mainData, true);;
    const OBKOLK2028bux = queryKor(Schet.S20, Schet.S28, TypeQuery.OKK, '', idForBuxanka, mainData, true);;

    const OBKOLK4028 = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, '', undefined, mainData, true);;
    const OBKOLK4028bux = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, '', idForBuxanka, mainData, true);;
   
    const TDKOL = query(Schet.S28, TypeQuery.TDKOL, null, mainData, true, '', true);
    const TDKOLbux = query(Schet.S28, TypeQuery.TDKOL, idForBuxanka, mainData, true, '', true);
    
    const TKKOL = query(Schet.S28, TypeQuery.TKKOL, null, mainData, true, '', true);
    const TKKOLbux = query(Schet.S28, TypeQuery.TKKOL, idForBuxanka, mainData, true, '', true);
    
    let [show, setShow] = useState<boolean>(false);
    return (
       <>
            <div className={styles.title}>
                {'ЦЕХЛАР'}
                <button 
                    className={styles.button}
                    onClick={()=> setShow(value => !value)}>
                        OK
                </button>
            </div>
            {
                show &&
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <td>Цех</td>
                            <td>Килинган хамир сони</td>
                            <td>Ишлатилган загатовка</td>
                            <td>Бир дона хамирга нис зувала</td>
                            <td>Колдик нон</td>
                            <td>Ишлаб чик. нон</td>
                            <td>Ички кирим силж.</td>
                            <td>Сотилган нон</td>
                            <td>Ички чиким силж.</td>
                            <td>Брак нон ва истемол</td>
                            <td>Колдик нон</td>
                        </tr>
                    </thead>
                    
                    {
                        data && data.length > 0 &&
                        data.filter((item: any) => {
                            return (item.filial)
                        })
                        .map((item: ReferenceModel, key: number) => {
                            return <ProductionItem key={key} currentId= {item._id} data={data} hamirs = {hamirs} title={item.name}/>
                        })
                    }    
                
                    {/* <thead>
                        <tr>
                            <td>Жами</td>
                            <td className={styles.totalTd}>-</td>
                            <td className={styles.totalTd}>-</td>
                            <td className={styles.totalTd}>-</td>
                            <td className={styles.totalTd}>
                                {numberValue(PDKOL-PKKOL-(PDKOLbux-PKKOLbux))}
                                <br/>
                                <span> ({numberValue(PDKOLbux-PKKOLbux)})</span>
                            </td>
                            <td className={styles.totalTd}>
                                {numberValue(OBKOLD2820-OBKOLD2820bux)}
                                <br/>
                                <span> ({numberValue(OBKOLD2820bux)})</span>
                            </td>
                            <td className={styles.totalTd}>
                                {numberValue(OBKOLD2828-OBKOLD2828bux)}
                                <br/>
                                <span> ({numberValue(OBKOLD2828bux)})</span>
                            </td>
                            <td className={styles.totalTd}>
                                {numberValue(OBKOLK4028-OBKOLK4028bux)}
                                <br/>
                                <span> ({numberValue(OBKOLK4028bux)})</span>
                            </td>
                            <td className={styles.totalTd}>
                                {numberValue(OBKOLK2828-OBKOLK2828bux)}
                                <br/>
                                <span> ({numberValue(OBKOLK2828bux)})</span>
                            </td>
                            <td className={styles.totalTd}>
                                {numberValue(OBKOLK2028-OBKOLK2028bux)}
                                <br/>
                                <span> ({numberValue(OBKOLK2028bux)})</span>
                            </td>
                            <td className={styles.totalTd}>
                                {numberValue(PDKOL - PKKOL + TDKOL - TKKOL - (PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux))}
                                <br/>
                                <span> ({numberValue(PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux)})</span>
                            </td>
                        </tr>
                    </thead> */}
                    
                </table>
            }
            
       </>
    )
} 