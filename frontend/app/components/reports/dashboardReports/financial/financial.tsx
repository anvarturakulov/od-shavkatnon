'use client';
import { FinancialProps } from './financial.props';
import styles from './financial.module.css';
import { useEffect, useMemo } from 'react';
import { numberValue } from '@/app/service/common/converters';
import { useAppContext } from '@/app/context/app.context';
import { totalByKey } from '../inform';

const total = (key: string, data: any[]) => {
  const item = data.find((item: any) => item?.innerReportType === key); // Заменил filter на find
  return item ? item.total : 0;
};

export const Financial = ({ className, data, ...props }: FinancialProps): JSX.Element => {
  const { mainData, setMainData } = useAppContext();
  const { currentFinancialInnerReportType } = mainData.report;

  useEffect(() => {
    // Пустой useEffect, можно убрать, если не планируется логика
  }, [data]);

  // Предвычисляем данные с помощью useMemo
  const { financialData, cashData, totals, innerValues } = useMemo(() => {
    console.time('Data Processing');
    const financialData = data?.find((item: any) => item?.reportType === 'FINANCIAL')?.values || [];
    const cashData = data?.find((item: any) => item?.reportType === 'CASH')?.values || [];

    const totals = {
      incomeSale: total('incomeSale', financialData),
      incomeOther: total('incomeOther', financialData),
      outZP: total('outZP', financialData),
      outPartner: total('outPartner', financialData),
      outFounder: total('outFounder', financialData),
      outCharge: total('outCharge', financialData),
      startBalans: totalByKey('startBalans', cashData),
      endBalans: totalByKey('endBalans', cashData),
    };

    const incomeAll = totals.incomeSale + totals.incomeOther;
    const outAll = totals.outZP + totals.outPartner + totals.outFounder + totals.outCharge;

    const innerReport = financialData.find((item: any) => item?.innerReportType === currentFinancialInnerReportType);
    const innerValues = innerReport?.innerValues || [];

    console.timeEnd('Data Processing');
    return { financialData, cashData, totals: { ...totals, incomeAll, outAll }, innerValues };
  }, [data, currentFinancialInnerReportType]);

  return (
    <>
      <div className={styles.title}>Пул окими</div>

      <div className={styles.box}>
        <div className={styles.main}>
          <table className={styles.table}>
            <thead>
              <tr>
                <td>Давр бошига колдик пуллар</td>
                <td className={styles.totalTd}>{numberValue(totals.startBalans)}</td>
              </tr>
              <tr>
                <td>Пул кирими</td>
                <td className={styles.totalTd}></td>
              </tr>
              <tr
                onDoubleClick={() => setMainData && setMainData('currentFinancialInnerReportType', 'incomeSale')}
              >
                <th>Корхонага кирган тирик савдо пули</th>
                <th className={styles.totalTd}>{numberValue(totals.incomeSale)}</th>
              </tr>
              <tr
                onDoubleClick={() => setMainData && setMainData('currentFinancialInnerReportType', 'incomeOther')}
              >
                <th>Четдан хамкорлардан кирган пул</th>
                <th className={styles.totalTd}>{numberValue(totals.incomeOther)}</th>
              </tr>
              <tr>
                <td>Жами</td>
                <td className={styles.totalTd}>{numberValue(totals.incomeAll)}</td>
              </tr>
              <tr>
                <td>Пул нимага харажат килинди</td>
                <td className={styles.totalTd}></td>
              </tr>
              <tr
                onDoubleClick={() => setMainData && setMainData('currentFinancialInnerReportType', 'outZP')}
              >
                <th>Ходимларга ойлик берилди</th>
                <th className={styles.totalTd}>{numberValue(totals.outZP)}</th>
              </tr>
              <tr
                onDoubleClick={() => setMainData && setMainData('currentFinancialInnerReportType', 'outCharge')}
              >
                <th>Корхона учун харажат килинди</th>
                <th className={styles.totalTd}>{numberValue(totals.outCharge)}</th>
              </tr>
              <tr
                onDoubleClick={() => setMainData && setMainData('currentFinancialInnerReportType', 'outPartner')}
              >
                <th>Таъминотчи ва хамкорларга берилди</th>
                <th className={styles.totalTd}>{numberValue(totals.outPartner)}</th>
              </tr>
              <tr
                onDoubleClick={() => setMainData && setMainData('currentFinancialInnerReportType', 'outFounder')}
              >
                <th>Таъсисчиларга берилди</th>
                <th className={styles.totalTd}>{numberValue(totals.outFounder)}</th>
              </tr>
              <tr>
                <td>Жами</td>
                <td className={styles.totalTd}>{numberValue(totals.outAll)}</td>
              </tr>
              <tr>
                <td>Бугунги тирик пулдан колди</td>
                <td className={styles.totalTd}>{numberValue(totals.incomeAll - totals.outAll)}</td>
              </tr>
              <tr>
                <td>Колган тирик ва утиб келувчи пул</td>
                <td className={styles.totalTd}>{numberValue(totals.endBalans)}</td>
              </tr>
            </thead>
          </table>
        </div>
        <div className={styles.inner}>
          <table className={styles.table}>
            <thead>
              <tr>
                <td className={styles.innerName}>Номи</td>
                <td className={styles.innerValue}>Сумма</td>
              </tr>
              {innerValues.map((element: any, index: number) => (
                <tr key={index}>
                  <th className={styles.innerName}>{element?.name}</th>
                  <th className={styles.innerValue}>{numberValue(element?.value)}</th>
                </tr>
              ))}
              <tr>
                <td className={styles.innerName}>Жами</td>
                <td className={styles.innerValue}>{numberValue(total(currentFinancialInnerReportType, financialData))}</td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
};