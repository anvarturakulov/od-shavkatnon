'use client'
import { FinancialProps } from './financial.props';
import styles from './financial.module.css';
import { useEffect } from 'react';
import { numberValue } from '@/app/service/common/converters';
import { useAppContext } from '@/app/context/app.context';
import { totalByKey } from '../inform';

export const total = (key:string, data:any[]) => {
    return data ? data.filter((item: any) => item?.innerReportType == key)[0]?.total : 0
}

export const Financial = ({className, data, ...props }: FinancialProps) :JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const {currentFinancialInnerReportType} = mainData;
    
    useEffect(()=> {

    }, [data])
    
    let datas = data ? data.filter((item: any) => item?.reportType == 'FINANCIAL')[0]?.values : []
    let datasCash = data ? data.filter((item: any) => item?.reportType == 'CASH')[0]?.values : []

    let incomeSale = total('incomeSale', datas)
    let incomeOther = total('incomeOther', datas)
    let incomeAll = incomeSale + incomeOther
    let outZP = total('outZP', datas)
    let outPartner = total('outPartner', datas)
    let outFounder = total('outFounder', datas)
    let outCharge = total('outCharge', datas)
    let outAll = outZP + outPartner + outFounder + outCharge;
    let startBalans = totalByKey('startBalans', datasCash)
    let endBalans = totalByKey('endBalans', datasCash)

    return (
       <>
            <div className={styles.title}>
                Пул окими
            </div>

            <div className={styles.box}>
                <div className={styles.main}>
                    <table className={styles.table}>
                    <thead>
                        <tr>
                            <td>Давр бошига колдик пуллар</td>
                            <td className={styles.totalTd}>{numberValue(startBalans)}</td>
                        </tr>
                        <tr>
                            <td>Пул кирими</td>
                            <td className={styles.totalTd}></td>
                        </tr>
                        <tr
                            onDoubleClick={() => {
                                setMainData && setMainData('currentFinancialInnerReportType', 'incomeSale')
                            }}
                        >
                            <th>Корхонага кирган тирик савдо пули</th>
                            <th className={styles.totalTd} >{numberValue(incomeSale)}</th>
                        </tr>
                        <tr
                            onDoubleClick={() => {
                                setMainData && setMainData('currentFinancialInnerReportType', 'incomeOther')
                            }}
                        >
                            <th className=''>Четдан хамкорлардан кирган пул</th>
                            <th className={styles.totalTd}>{numberValue(incomeOther)}</th>
                        </tr>
                        <tr>
                            <td>Жами</td>
                            <td className={styles.totalTd}>{numberValue(incomeAll)}</td>
                        </tr>
                        <tr>
                            <td>Пул нимага харажат килинди</td>
                            <td className={styles.totalTd}></td>
                        </tr>
                        <tr
                            onDoubleClick={() => {
                                setMainData && setMainData('currentFinancialInnerReportType', 'outZP')
                            }}
                        >
                            <th>Ходимларга ойлик берилди</th>
                            <th className={styles.totalTd} >{numberValue(outZP)}</th>
                        </tr>
                        <tr
                            onDoubleClick={() => {
                                setMainData && setMainData('currentFinancialInnerReportType', 'outCharge')
                            }}
                        >
                            <th className=''>Корхона учун харажат килинди</th>
                            <th className={styles.totalTd}>{numberValue(outCharge)}</th>
                        </tr>
                        <tr
                            onDoubleClick={() => {
                                setMainData && setMainData('currentFinancialInnerReportType', 'outPartner')
                            }}
                        >
                            <th>Таъминотчи ва хамкорларга берилди</th>
                            <th className={styles.totalTd} >{numberValue(outPartner)}</th>
                        </tr>
                        <tr
                            onDoubleClick={() => {
                                setMainData && setMainData('currentFinancialInnerReportType', 'outFounder')
                            }}
                        >
                            <th className=''>Таъсисчиларга берилди</th>
                            <th className={styles.totalTd}>{numberValue(outFounder)}</th>
                        </tr>
                        <tr>
                            <td>Жами</td>
                            <td className={styles.totalTd}>{numberValue(outAll)}</td>
                        </tr>
                        <tr>
                            <td>Бугунги тирик пулдан колди</td>
                            <td className={styles.totalTd}>{numberValue(incomeAll-outAll)}</td>
                        </tr>
                        <tr>
                            <td>Колган тирик ва утиб келувчи пул</td>
                            <td className={styles.totalTd}>{numberValue(endBalans)}</td>
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
                            {
                                datas && datas.length &&
                                datas.filter((item: any) => item?.innerReportType == currentFinancialInnerReportType)[0]?.innerValues
                                .map((element: any) => {
                                    return (
                                        <>
                                            <tr>
                                                <th className={styles.innerName}>{element?.name}</th>
                                                <th className={styles.innerValue}>{numberValue(element?.value)}</th>
                                            </tr>
                                        </>
                                    )
                                })
                            }
                            <tr>
                                <td className={styles.innerName}>Жами</td>
                                <td className={styles.innerValue}>{numberValue(total(currentFinancialInnerReportType, datas))}</td>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            
            
       </>
    )
} 

