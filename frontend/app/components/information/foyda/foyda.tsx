'use client'
import { FoydaProps } from './foyda.props';
import { FoydaItem } from './foydaItem/foydaItem';
import styles from './foyda.module.css';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { useState } from 'react';
import { query } from '@/app/service/reports/querys/query';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { queryKor } from '@/app/service/reports/querys/queryKor';
import { useAppContext } from '@/app/context/app.context';
import { numberValue } from '@/app/service/common/converters';

type cashTableItemIds = 'PDSUM' | 'PKSUM' | 'TRADEINCOME' | 'MOVEINCOME' | 'MOVEOUT' |
    'CHARGES' | 'FORPARTNERS' | 'FORFOUNDER' | 'TDSUM' | 'TKSUM' 

interface foydaTableItemsTotal {
    PDSUM: number,
    PKSUM: number,
    TRADEINCOME: number,
    MOVEINCOME: number,
    MOVEOUT: number,
    CHARGES: number,
    FORPARTNERS: number
    FORFOUNDER: number,
    TDSUM: number,
    TKSUM: number
}

const defaultValue: foydaTableItemsTotal = {
    PDSUM: 0,
    PKSUM: 0,
    TRADEINCOME: 0,
    MOVEINCOME: 0,
    MOVEOUT: 0,
    CHARGES: 0,
    FORPARTNERS: 0,
    FORFOUNDER: 0,
    TDSUM: 0,
    TKSUM: 0
}

export const Foyda = ({className, data, ...props }: FoydaProps) :JSX.Element => {
    const [total, setTotal] = useState<foydaTableItemsTotal>(defaultValue);
    const {mainData, setMainData} = useAppContext()

    const PDSUM = query(Schet.S50, TypeQuery.PDSUM, null, mainData, false, '', true);
    const PKSUM = query(Schet.S50, TypeQuery.PKSUM, null, mainData, false, '', true);
    const TRADEINCOME = queryKor(Schet.S50, Schet.S40, TypeQuery.ODS, '', undefined, mainData, true);
    const MOVEINCOME = queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, '', undefined, mainData, true);
    const MOVEOUT = queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, '', undefined, mainData, true);
    const CHARGES = queryKor(Schet.S20, Schet.S50, TypeQuery.OKS, '', undefined, mainData, true);
    const FORPARTNERS = queryKor(Schet.S60, Schet.S50, TypeQuery.OKS, '', undefined, mainData, true);
    const FORFOUNDER = queryKor(Schet.S66, Schet.S50, TypeQuery.OKS, '', undefined, mainData, true);
    const TDSUM = query(Schet.S50, TypeQuery.TDSUM, null, mainData, false, '', true);
    const TKSUM = query(Schet.S50, TypeQuery.TKSUM, null, mainData, false, '', true);

    let [show, setShow] = useState<boolean>(false);
    return (
       <>
            <div className={styles.title}>
                ФOЙДА ХИСОБИ
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
                            <td >Цех</td>
                            <td>Ишлаб чикар. нон сони</td>
                            <td>Савдодаги нон сони</td>
                            <td>Савдодага пул маблаги</td>
                            <td>Ун харажати</td>
                            <td>Хом ашёлар хараж.</td>
                            <td>Иш хаки хараж.</td>
                            <td>Кунлик пуллик хараж.</td>
                            <td>Жорий фойда</td>
                            <td>Фойда коэф (%)</td>
                            <td>Ойлик пуллик хараж</td>
                            <td>Соф фойда</td>
                        </tr>
                    </thead>
                    {
                        data && data.length > 0 &&
                        data
                        .filter((item: any) => item?.typeReference == TypeReference.STORAGES)
                        .filter((item: ReferenceModel) => {
                            // if (item.buxgalter) console.log(item.name)
                            if ( item.filial || item.umumBulim ) return true
                            return false
                        })
                        .map((item: ReferenceModel, key: number) => {
                            return <FoydaItem 
                                key={key}
                                currentSectionId= {item._id} 
                                data={data} 
                                title={item.name}
                                />
                        })
                    }
                    <thead>
                        <tr>
                            <td>Жами</td>
                            <td className={styles.totalTd}>{numberValue(PDSUM-PKSUM)}</td>
                            <td className={styles.totalTd}>{numberValue(FORFOUNDER)}</td>
                            <td className={styles.totalTd}>{numberValue(TRADEINCOME)}</td>
                            <td className={styles.totalTd}>{numberValue(MOVEINCOME)}</td>
                            <td className={styles.totalTd}>{numberValue(TRADEINCOME+MOVEINCOME)}</td>
                            <td className={styles.totalTd}>{numberValue(CHARGES)}</td>
                            <td className={styles.totalTd}>{numberValue(FORPARTNERS)}</td>
                            <td className={styles.totalTd}>{numberValue(MOVEOUT)}</td>
                            <td className={styles.totalTd}>{numberValue(FORFOUNDER)}</td>
                            <td className={styles.totalTd}>{numberValue(CHARGES+FORPARTNERS+MOVEOUT+FORFOUNDER)}</td>
                            <td className={styles.totalTd}>{numberValue(PDSUM-PKSUM+TDSUM-TKSUM)}</td>
                        </tr>
                    </thead>
                </table>
            }
            
       </>
    )
} 

