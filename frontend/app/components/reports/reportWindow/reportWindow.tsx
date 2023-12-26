import { useState } from 'react'
import { ReportWindowProps } from './reportWindow.props'
import { OptionsToGenerateReport, ReportsType } from '../../../interfaces/report.interface'
import OptionsBox from '../optionsBox/optionsBox'

const defaultOptionsToReport: OptionsToGenerateReport = {
    startDate: new Date(),
    endDate: new Date(),
    referenceId: '',
    reportsType: ReportsType.AktSverka
}

export default function ReportWindow({ reportsType, className, ...props }: ReportWindowProps):JSX.Element {
    const [report, setShowReport] = useState<boolean>(false)
    const [reportOptions, setReportOptions] = useState()
    const [options, setOptions] = useState<OptionsToGenerateReport>(defaultOptionsToReport)

    
    const showReport = (options: OptionsToGenerateReport, go:string)=> {
        setShowReport(state=> !state)
        setOptions(options)
    }

    return (
        <>
            <OptionsBox 
                reportsType={reportsType}
                showReport={showReport}    
            />
            {/* {report && 
            <Report options={options} />} */}
        </>
    )
}