'use client'
import { DebitorKreditorProps } from './debitorKreditor.props';
import styles from './debitorKreditor.module.css';
import { useEffect } from 'react';
import { numberValue } from '@/app/service/common/converters';
import { useAppContext } from '@/app/context/app.context';

export const total = (key:string, data:any[], value: string) => {
    return data ? data.filter((item: any) => item?.innerReportType == key)[0]?.[value] : 0
}

// const total = (key: string, data: any[], value: string) => {
//     if (data) {
//         const item = data.find((item: any) => item?.innerReportType === key); // Заменил filter на find
//         return item ? item[value] || 0 : 0;
//     }
//     return 0
// };

export const setDebitKreditInnerData = (currentDKInnerReportId: string, currentDKInnerArrayId: string, setMainData: Function | undefined ) =>{
    if (setMainData) {
        setMainData('currentDKInnerReportId', currentDKInnerReportId)    
        setMainData('currentDKInnerArrayId', currentDKInnerArrayId)
    }
}

const rowData = (title: string, reportID: string, debitArrayId: string , kreditArrayId: string, valueStart: number, valueEnd: number, setDebitKreditInnerData: Function, setMainData: Function | undefined ):JSX.Element => {
    return (
        <tr>
            <th>{title}</th>
            <th className={styles.totalTd}
                onDoubleClick={() => setDebitKreditInnerData(reportID, debitArrayId, setMainData)}
            >
                {numberValue(valueStart)}
            </th>
            <th className={styles.totalTd} 
                onDoubleClick={() => setDebitKreditInnerData(reportID, kreditArrayId, setMainData)}
            >
                {numberValue(valueEnd)}
            </th>
        </tr>
    )
}

export const DebitorKreditor = ({className, data, ...props }: DebitorKreditorProps) :JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const {currentDKInnerReportId, currentDKInnerArrayId} = mainData.report;
    
   
    let datas = data ? data.filter((item: any) => item?.reportType == 'DEBITORKREDITOR')[0]?.values : []

    let materialDebitStart = total('MATERIAL', datas, 'totalDebitStart')
    let materialDebitEnd = total('MATERIAL', datas, 'totalDebitEnd')
    let materialKreditStart = total('MATERIAL', datas, 'totalKreditStart')
    let materialKreditEnd = total('MATERIAL', datas, 'totalKreditEnd')
    
    let zagatovkaDebitStart = total('ZAGATOVKA', datas, 'totalDebitStart')
    let zagatovkaDebitEnd = total('ZAGATOVKA', datas, 'totalDebitEnd')
    let zagatovkaKreditStart = total('ZAGATOVKA', datas, 'totalKreditStart')
    let zagatovkaKreditEnd = total('ZAGATOVKA', datas, 'totalKreditEnd')
    
    let filialDebitStart = total('FILIAL', datas, 'totalDebitStart')
    let filialDebitEnd = total('FILIAL', datas, 'totalDebitEnd')
    let filialKreditStart = total('FILIAL', datas, 'totalKreditStart')
    let filialKreditEnd = total('FILIAL', datas, 'totalKreditEnd')
    
    let buxgalterDebitStart = total('BUXGALTER', datas, 'totalDebitStart')
    let buxgalterDebitEnd = total('BUXGALTER', datas, 'totalDebitEnd')
    let buxgalterKreditStart = total('BUXGALTER', datas, 'totalKreditStart')
    let buxgalterKreditEnd = total('BUXGALTER', datas, 'totalKreditEnd')
    
    let deliveryDebitStart = total('DELIVERY', datas, 'totalDebitStart')
    let deliveryDebitEnd = total('DELIVERY', datas, 'totalDebitEnd')
    let deliveryKreditStart = total('DELIVERY', datas, 'totalKreditStart')
    let deliveryKreditEnd = total('DELIVERY', datas, 'totalKreditEnd')
    
    let partnersDebitStart = total('PARTNERS', datas, 'totalDebitStart')
    let partnersDebitEnd = total('PARTNERS', datas, 'totalDebitEnd')
    let partnersKreditStart = total('PARTNERS', datas, 'totalKreditStart')
    let partnersKreditEnd = total('PARTNERS', datas, 'totalKreditEnd')
    
    let workersDebitStart = total('WORKERS', datas, 'totalDebitStart')
    let workersDebitEnd = total('WORKERS', datas, 'totalDebitEnd')
    let workersKreditStart = total('WORKERS', datas, 'totalKreditStart')
    let workersKreditEnd = total('WORKERS', datas, 'totalKreditEnd')
    
    let foundersDebitStart = total('FOUNDERS', datas, 'totalDebitStart')
    let foundersDebitEnd = total('FOUNDERS', datas, 'totalDebitEnd')
    let foundersKreditStart = total('FOUNDERS', datas, 'totalKreditStart')
    let foundersKreditEnd = total('FOUNDERS', datas, 'totalKreditEnd')

    let allDebitStart = materialDebitStart + zagatovkaDebitStart + filialDebitStart + buxgalterDebitStart + deliveryDebitStart + partnersDebitStart + workersDebitStart + foundersDebitStart;
    let allDebitEnd = materialDebitEnd + zagatovkaDebitEnd + filialDebitEnd + buxgalterDebitEnd + deliveryDebitEnd + partnersDebitEnd + workersDebitEnd + foundersDebitEnd;
    let allKreditStart = materialKreditStart + zagatovkaKreditStart + filialKreditStart + buxgalterKreditStart + deliveryKreditStart + partnersKreditStart + workersKreditStart + foundersKreditStart;
    let allKreditEnd = materialKreditEnd + zagatovkaKreditEnd + filialKreditEnd + buxgalterKreditEnd + deliveryKreditEnd + partnersKreditEnd + workersKreditEnd + foundersKreditEnd;


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
                            <td></td>
                            <td className={styles.totalTd}>Давр бошига колдик</td>
                            <td className={styles.totalTd}>Давр охирига колдик</td>
                        </tr>
                        <tr>
                            <td>АКТИВ (бизда бор)</td>
                            <td className={styles.totalTd}></td>
                            <td className={styles.totalTd}></td>
                        </tr>
                        { rowData('Хом ашё', 'MATERIAL', 'innersDebitStart', 'innersDebitEnd', materialDebitStart, materialDebitEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Загатовка', 'ZAGATOVKA', 'innersDebitStart', 'innersDebitEnd', zagatovkaDebitStart, zagatovkaDebitEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Цехлар', 'FILIAL', 'innersDebitStart', 'innersDebitEnd', filialDebitStart, filialDebitEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Бухгалтерлар', 'BUXGALTER', 'innersDebitStart', 'innersDebitEnd', buxgalterDebitStart, buxgalterDebitEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Доставщиклар', 'DELIVERY', 'innersDebitStart', 'innersDebitEnd',deliveryDebitStart, deliveryDebitEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Таъминотчилардаги аванслар', 'PARTNERS', 'innersDebitStart', 'innersDebitEnd', partnersDebitStart, partnersDebitEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Ходимлардаги аванслари', 'WORKERS', 'innersDebitStart', 'innersDebitEnd', workersDebitStart, workersDebitEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Таъсисчиларнинг карзи', 'FOUNDERS', 'innersDebitStart', 'innersDebitEnd', foundersDebitStart, foundersDebitEnd, setDebitKreditInnerData, setMainData)}
                        <tr>
                            <td>Жами</td>
                            <td className={styles.totalTd}>{numberValue(allDebitStart)}</td>
                            <td className={styles.totalTd}>{numberValue(allDebitEnd)}</td>
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            <td>ПАССИВ (Карзимиз)</td>
                            <td className={styles.totalTd}></td>
                            <td className={styles.totalTd}></td>
                        </tr>
                        { rowData('Хом ашё (минус)', 'MATERIAL', 'innersKreditStart', 'innersKreditEnd', materialKreditStart, materialKreditEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Загатовка (минус)', 'ZAGATOVKA', 'innersKreditStart', 'innersKreditEnd', zagatovkaKreditStart, zagatovkaKreditEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Цехлар', 'FILIAL', 'innersKreditStart', 'innersKreditEnd', filialKreditStart, filialKreditEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Бухгалтер', 'BUXGALTER', 'innersKreditStart', 'innersKreditEnd', buxgalterKreditStart, buxgalterKreditEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Доставщик', 'DELIVERY', 'innersKreditStart', 'innersKreditEnd',deliveryKreditStart, deliveryKreditEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Таъминотчилардан карзимиз', 'PARTNERS', 'innersKreditStart', 'innersKreditEnd', partnersKreditStart, partnersKreditEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Ходимлардан карзимиз', 'WORKERS', 'innersKreditStart', 'innersKreditEnd', workersKreditStart, workersKreditEnd, setDebitKreditInnerData, setMainData)}
                        { rowData('Таъсисчилардан карзимиз', 'FOUNDERS', 'innersKreditStart', 'innersKreditEnd', foundersKreditStart, foundersKreditEnd, setDebitKreditInnerData, setMainData)}
                        <tr>
                            <td>Жами</td>
                            <td className={styles.totalTd}>{numberValue(allKreditStart)}</td>
                            <td className={styles.totalTd}>{numberValue(allKreditEnd)}</td>
                        </tr>

                        <tr>
                            <td>ФАРК</td>
                            <td className={styles.totalTdSame}>{numberValue(allDebitStart-allKreditStart)}</td>
                            <td className={styles.totalTdSame}>{numberValue(allDebitEnd-allKreditEnd)}</td>
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
                                datas.filter((item: any) => item?.innerReportType == currentDKInnerReportId)[0]?.[currentDKInnerArrayId]
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
                                {/* <td className={styles.innerName}>Жами</td> */}
                                {/* <td className={styles.innerValue}>{numberValue(total(currentFinancialInnerReportType, datas))}</td> */}
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            
            
       </>
    )
} 

