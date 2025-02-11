'use client'
import { TakingItemProps } from './takingItem.props';
import styles from './takingItem.module.css';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { query } from '@/app/service/reports/querys/query';
import { numberValue } from '@/app/service/common/converters';
import { queryKor } from '@/app/service/reports/querys/queryKor';
import { HamirModel } from '@/app/interfaces/hamir.interface';

export const TakingItem = ({className, item, ...props }: TakingItemProps) :JSX.Element => {
    
    return (
        <tbody>
            <tr>
                <td className={styles.title}>{item?.section}</td>
                <td className={styles.value}>{numberValue(item?.taking)}</td>
            </tr>
        </tbody>
    )
} 