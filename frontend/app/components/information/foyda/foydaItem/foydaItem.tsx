'use client'
import { FoydaItemProps } from './foydaItem.props';
import styles from './foydaItem.module.css';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { query } from '@/app/service/reports/querys/query';
import { numberValue } from '@/app/service/common/converters';
import { queryKor } from '@/app/service/reports/querys/queryKor';

export const FoydaItem = ({className, data, currentSectionId, title, ...props }: FoydaItemProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext()
    let idForBuxanka = '65e7048b5c54490bbc335ca2';
    const productionCount = queryKor(Schet.S28, Schet.S20, TypeQuery.OKK, currentSectionId, undefined, mainData, true);
    
    const moveOutCount = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, currentSectionId, undefined, mainData, true);
    const moveOutCountBux = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, currentSectionId, idForBuxanka, mainData, true);
    const moveIncomeCount = queryKor(Schet.S28, Schet.S28, TypeQuery.ODK, currentSectionId, undefined, mainData, true);;
    const moveIncomeCountBux = queryKor(Schet.S28, Schet.S28, TypeQuery.OKK, currentSectionId, idForBuxanka, mainData, true);
    
    const saleCount = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, currentSectionId, undefined, mainData, true);
    const saleCountBux = queryKor(Schet.S40, Schet.S28, TypeQuery.OKK, currentSectionId, idForBuxanka, mainData, true);
    const sale = queryKor(Schet.S40, Schet.S28, TypeQuery.OKS, currentSectionId, undefined, mainData, true);
    
    // console.log(sale)
    const saleCountWithMove = saleCount - moveOutCount + moveIncomeCount;
    
    const saleForMoveIncomeNon = (moveIncomeCount-moveIncomeCountBux) ? (moveIncomeCount-moveIncomeCountBux) : 0;
    const saleForMoveIncomeBux =  moveIncomeCountBux ? moveIncomeCountBux : 0;
    const saleWithMove = sale + saleForMoveIncomeNon*3500+saleForMoveIncomeBux*2000;
    
    const zagatovka = queryKor(Schet.S20, Schet.S21, TypeQuery.OKS, currentSectionId, undefined, mainData, true);
    const materials = queryKor(Schet.S20, Schet.S10, TypeQuery.OKS, currentSectionId, undefined, mainData, true);;
    const zp = queryKor(Schet.S20, Schet.S67, TypeQuery.ODS, currentSectionId, undefined, mainData, true);;
    const currentPayment = queryKor(Schet.S20, Schet.S50, TypeQuery.OKS, currentSectionId, undefined, mainData, true);;
    const currentCharges = zagatovka + materials + zp + currentPayment;
    const currentEarning = sale - zagatovka - currentCharges;
    const koefCurrentEarningToOneProduct = 0;
    const longPayment =  0;//queryKor(Schet.S25, Schet.S50, TypeQuery.OKS, currentSectionId, undefined, mainData, true);;
    const realEarning = sale - currentCharges - longPayment;

    return (
       <>
        <tbody>
            <tr>
              <td className={styles.title}>{title}</td>
              <td>{numberValue(productionCount)}</td>
              <td>{numberValue(saleCountWithMove)}</td>
              <td>{numberValue(saleWithMove)}</td>
              <td>{numberValue(zagatovka)}</td>
              <td >{numberValue(materials)}</td>
              <td>{numberValue(zp)}</td>
              <td>{numberValue(currentPayment)}</td>
              <td>{numberValue(currentEarning)}</td>
              <td>{numberValue(koefCurrentEarningToOneProduct)}</td>
              <td>{numberValue(longPayment)}</td>
              <td>{numberValue(realEarning)}</td>
            </tr>
        </tbody>
      </>
    )
} 