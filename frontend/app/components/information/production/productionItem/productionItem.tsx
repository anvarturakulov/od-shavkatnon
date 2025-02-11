'use client'
import { ProductionItemProps } from './productionItem.props';
import styles from './productionItem.module.css';
import cn from 'classnames';
import { Htag } from '@/app/components';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { query } from '@/app/service/reports/querys/query';
import { numberValue } from '@/app/service/common/converters';
import { queryKor } from '@/app/service/reports/querys/queryKor';
import { HamirModel } from '@/app/interfaces/hamir.interface';

export const ProductionItem = ({className, currentId, data, hamirs , title,  ...props }: ProductionItemProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext()
    let currentHamirs, currentZagatovka, colHamirs, colZagatovka; 
    let colNon = 0;
    let zuvalaKPI = 0;

    if (hamirs) {
        currentHamirs = hamirs.filter((item: HamirModel) => {
            return (item.sectionId == currentId && item.proveden && item.zuvala && !item.fromHamirchi)
        })
        currentZagatovka = hamirs.filter((item: HamirModel) => {
            return (item.sectionId == currentId && item.proveden && item.zuvala && item.fromHamirchi)
        })

        // colNon = currentHamirs.reduce((acc:number, item: HamirModel) => {acc + item.zuvala, 0)
        currentHamirs.forEach((item:HamirModel) => {
            if (item.zuvala) colNon += item.zuvala
        });
        
        colHamirs = currentHamirs.length
        colZagatovka = currentZagatovka.length
        if (colHamirs) {
            zuvalaKPI = (colNon / colHamirs)
        }
    }
    

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

    return (
        <tbody>
            <tr>
                <td>{title}</td>
                <td className={styles.value}>{colHamirs}</td>
                <td className={styles.value}>{colZagatovka}</td>
                <td>{zuvalaKPI.toFixed(1)}</td>
                <td className={styles.value}>
                    {numberValue(PDKOL-PKKOL-(PDKOLbux-PKKOLbux))}
                    <br/>
                    <span> ({numberValue(PDKOLbux-PKKOLbux)})</span>
                </td>
                <td className={styles.value}>
                    {numberValue(OBKOLD2820-OBKOLD2820bux)}
                    <br/>
                    <span> ({numberValue(OBKOLD2820bux)})</span>
                </td>
                <td className={styles.value}>
                    {numberValue(OBKOLD2828-OBKOLD2828bux)}
                    <br/>
                    <span> ({numberValue(OBKOLD2828bux)})</span>
                </td>
                <td className={styles.value}>
                    {numberValue(OBKOLK4028-OBKOLK4028bux)}
                    <br/>
                    <span> ({numberValue(OBKOLK4028bux)})</span>
                </td>
                <td className={styles.value}>
                    {numberValue(OBKOLK2828-OBKOLK2828bux)}
                    <br/>
                    <span> ({numberValue(OBKOLK2828bux)})</span>
                </td>
                <td className={styles.value}>
                    {numberValue(OBKOLK2028-OBKOLK2028bux)}
                    <br/>
                    <span> ({numberValue(OBKOLK2028bux)})</span>
                </td>
                <td className={styles.value}>
                    {numberValue(PDKOL - PKKOL + TDKOL - TKKOL - (PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux))}
                    <br/>
                    <span> ({numberValue(PDKOLbux - PKKOLbux + TDKOLbux - TKKOLbux)})</span>
                </td>
            </tr>
        </tbody>
    )
} 