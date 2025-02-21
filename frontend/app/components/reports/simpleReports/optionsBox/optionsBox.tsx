import { OptionsBoxProps } from './optionsBox.props';
import styles from './optionsBox.module.css';
import { Input } from '@/app/components';
import { getOptionsByReportType } from '@/app/service/reports/getOptionsByReportType';
import { SelectReference } from './components/selectReference/selectReference';
import { TypeReference } from '@/app/interfaces/reference.interface';
import { useAppContext } from '@/app/context/app.context';
import { onChangeInputOptionsBox } from './helpers/optionsBox.functions';
import { Maindata } from '@/app/context/app.context.interfaces';
import { showMessage } from '@/app/service/common/showMessage';
import { ReportType } from '@/app/interfaces/report.interface';
import { SelectOborot } from './components/selectOborot/selectOborot';
import { getMatOborot } from '@/app/service/reports/getMatOborot';
import { getOborotka } from '@/app/service/reports/getOborotka';


export default function OptionsBox({ className, ...props }: OptionsBoxProps): JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const {contentName, contentTitle} = mainData.window;
    const {reportOption} = mainData.report;
    const result = getOptionsByReportType(contentName, reportOption.schet);

    const showReport = ( setMainData: Function | undefined, mainData: Maindata ) => {
        console.log('show report - '+Date.now())
        const { reportOption } = mainData.report;
        const { startDate, endDate } = reportOption;
        if ( startDate != 0 && endDate != 0 ) {
            setMainData && setMainData('uploadingDashboard', true);
            if (contentName == ReportType.MatOborot) getMatOborot(setMainData, mainData)
            if (contentName == ReportType.Oborotka) getOborotka(setMainData, mainData) 
            else return true;
        } else {
            showMessage('Санани тулдиринг', 'error', setMainData);
        }
    }

    return (

        <div className={styles.box}>
            
            <div className={styles.title}>{`${contentTitle} буйича хисобот88`}</div>
            <div className={styles.dataBox}>
                <Input label='Бошлангич сана' type='date' id='startDate' onChange={(e)=> onChangeInputOptionsBox(e, setMainData, mainData)}/>
                <Input label='Охирги сана' type='date' id='endDate' onChange={(e) => onChangeInputOptionsBox(e, setMainData, mainData)} />
            </div>

            <div className={styles.dataBoxBottom}>
                <SelectOborot label='Айланма тури' visible={contentName == ReportType.Oborotka}/>
            </div>
            
            <div className={styles.dataBoxBottom}>
                <SelectReference 
                    label={result.label} 
                    typeReference={result.typeReference} 
                    id={'firstReferenceId'}
                    visible={true}
                />
            </div>

            <div className={styles.dataBoxBottom}>
                <SelectReference 
                    label='222' 
                    typeReference={TypeReference.WORKERS} 
                    id={'secondReferenceId'}
                    visible={false}
                />
            </div>
            
            <button 
                className={styles.button}
                onClick={()=> showReport(setMainData, mainData)}>
                Хисоботни шакллантириш
            </button>

        </div>
    )
} 