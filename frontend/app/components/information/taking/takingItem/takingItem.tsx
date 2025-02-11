'use client'
import { TakingItemProps } from './takingItem.props';
import styles from './takingItem.module.css';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { query } from '@/app/service/reports/querys/query';
import { numberValue } from '@/app/service/common/converters';
import { queryKor } from '@/app/service/reports/querys/queryKor';
import { HamirModel } from '@/app/interfaces/hamir.interface';

export const TakingItem = ({className, currentId, data, hamirs , title,  ...props }: TakingItemProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext()

    // const OBSUMD5050 = queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, currentId, undefined, mainData, true);
    const OBSUMK5050 = queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, currentId, undefined, mainData, true);

    return (
        <tbody>
            <tr>
                <td className={styles.title}>{title}</td>
                <td className={styles.value}>{numberValue(OBSUMK5050)}</td>
            </tr>
        </tbody>
    )
} 