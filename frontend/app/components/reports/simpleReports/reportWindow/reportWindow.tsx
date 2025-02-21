import { ReportWindowProps } from './reportWindow.props'
import OptionsBox from '../optionsBox/optionsBox'
import { useAppContext } from '@/app/context/app.context'
import ReportTable from '../reportTable/reportTable'
import LoadingIco from  './loading.svg'

export default function ReportWindow({ className, ...props }: ReportWindowProps):JSX.Element {
    const {mainData, setMainData} = useAppContext()
    const { startReport } = mainData.report.reportOption;
    const { uploadingDashboard } = mainData.window

    const content = !startReport ? <OptionsBox/> : <ReportTable/>;
    
    return (
        
        <>
            { !startReport && !uploadingDashboard && <OptionsBox/> }

            { startReport && <ReportTable/> }
            
            { !startReport && uploadingDashboard && <LoadingIco/> }
            
        </>
    )
}
