import styles from './reportTable.module.css';
import { ReportTableProps } from './reportTable.props';
import { useRef } from 'react';
import {useReactToPrint} from 'react-to-print';
import PrintIco from './ico/print.svg';
import { useAppContext } from '@/app/context/app.context';
import { ReportType, Schet } from '@/app/interfaces/report.interface';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { dateToStr } from '@/app/service/reports/dateToStr';
import { MatOborot } from './table/matOborot/matOborot';
import { Oborotka } from './table/oborotka/oborotka';

export default function ReportTable({ className, ...props} : ReportTableProps):JSX.Element {
    
    const {mainData} = useAppContext();
    const {contentName, contentTitle} = mainData.window;
    const {reportOption} = mainData.report;
    const {startDate, startReport, endDate, firstReferenceId, schet} = reportOption;

    const { user } = mainData.users;
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/getAll/';

    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    const componentRef = useRef<HTMLInputElement>(null)

    const handlePrint = useReactToPrint({
        content : () => componentRef.current,
        documentTitle: contentTitle
    })
    
   
    if (!startReport) return <></>

    let titleV = (firstReferenceId != null && firstReferenceId != 0) ? 
        ( <div>
            <span>{getPropertySubconto(data,firstReferenceId).name}</span> буйича
        </div> ) 
        :
        (<span>умумий корхона буйича</span>)

    return (
        <>
            <div className={styles.container} ref={componentRef} >
                <div className={styles.titleBox}>
                    <div className={styles.organization}>{`'Шавкат Нон' хусусий корхонаси`}</div>
                    <div className={styles.title}>{`${contentTitle} хисоботи`}</div>
                    <div>{`Хисобот даври: ${dateToStr(startDate)} дан ${dateToStr(endDate)}`}</div>
                    <div>{titleV}</div>
                </div>

                { 
                    contentName == ReportType.MatOborot && 
                    <MatOborot />
                }

                {
                    contentName == ReportType.Oborotka && 
                    <Oborotka />
                }

                {/* {contentName == ReportType.Personal && 
                    <Personal 
                        data={data}
                    />
                } */}
                
            </div>
            <PrintIco onClick={handlePrint} className={styles.ico}/>
        </>
    )
}
