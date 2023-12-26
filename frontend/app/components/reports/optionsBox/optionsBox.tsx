import { OptionsBoxProps } from './optionsBox.props';
import styles from './optionsBox.module.css';
import { Input, SelectReferenceInForm } from '@/app/components';
import { useState } from 'react';
import { getOptionsByReportType } from '@/app/utils/getOptionsByReportType';
import { OptionsToGenerateReport, ReportsType } from '@/app/interfaces/report.interface';

const defaultOptionsToReport: OptionsToGenerateReport = {
    startDate: new Date(),
    endDate: new Date(),
    referenceId: '',
    reportsType: ReportsType.AktSverka
}

export default function OptionsBox({ reportsType, showReport, className, ...props }: OptionsBoxProps): JSX.Element {
    
    const [optionsToReport, setOptionsToReport] = useState<OptionsToGenerateReport>(defaultOptionsToReport)

    const optionForReference = getOptionsByReportType(reportsType)

    const onChangeInput = (e: React.FormEvent<HTMLInputElement>)=> {
        let target = e.currentTarget
        setOptionsToReport(state => {
            return {
                ...state,
                [target.id]: new Date(target.value).toISOString().slice(0, 10),
                reportsType
            }
        })
    }

    const onChangeSelect = (e: React.FormEvent<HTMLSelectElement>) => {
        let target = e.currentTarget
        setOptionsToReport(state => {
            return {
                ...state,
                referenceId: target.value,
                reportsType
            }
        })
    }

    return (

        <div className={styles.box}>
            <div className={styles.title}>{`${reportsType} буйича хисобот`}</div>
            <div className={styles.dataBox}>
                <Input label='Бошлангич сана' type='date' id='startDate' onChange={(e)=> onChangeInput(e)}/>
                <Input label='Бошлангич сана' type='date' id='endDate' onChange={(e) => onChangeInput(e)} />
                <SelectReferenceInForm
                    label={optionForReference.label}
                    typeReference={optionForReference.typeReference}
                    visibile={true}
                    id='select'
                    onChange={(e) => onChangeSelect(e)}
                />
            </div>
            
            <button 
                className={styles.button}
                onClick={() => showReport(optionsToReport, 'go')}
                >Хисоботни шакллантириш</button>
        </div>
    )
} 