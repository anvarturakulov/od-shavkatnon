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

export const ProductionItem = ({className, item, ...props }: ProductionItemProps) :JSX.Element => {
    
    return (
        <tbody>
            <tr>
                <td>{item?.section}</td>
                <td className={styles.value}>{item?.countHamirs}</td>
                <td className={styles.value}>{item?.countZagatovka}</td>
                <td>{item?.zuvalaKPI.toFixed(1)}</td>
                
            </tr>
        </tbody>
    )
} 