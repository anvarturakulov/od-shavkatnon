'use client'
import { InformationProps } from './inform.props';
import { useAppContext } from '@/app/context/app.context';
import { RefreshPanel } from './refreshPanel/refreshPanel';
import { useEffect } from 'react';
import { getReportByType } from './helper';
import LoadingIco from './loading.svg';

export const totalByKey = (key:string, data:any[]) => {
    let total = 0;
    data && data.length &&
    data.forEach((item:any) => {
        total += item[key]
    })
    return total
}

export const totalByKeyForFinancial = (key:string, data:any[]) => {
    let total = 0;
    data && data.length &&
    data.forEach((item:any) => {
        total += item[key]
    })
    return total
}


export const Inform = ({className, ...props }: InformationProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { uploadingDashboard } = mainData.window;
    const { informData, dashboardCurrentReportType } = mainData.report;
    let reportType = dashboardCurrentReportType;
    
    return (
       <>
            <RefreshPanel/>
            {
                !uploadingDashboard &&
                getReportByType(reportType, informData)
            }
            {
                uploadingDashboard &&
                <LoadingIco/>
            }
       </>
    )
} 