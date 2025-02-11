'use client'
import { useEffect, useState } from 'react';
import { RefreshPanelProps } from './resfreshPanel.props';
import styles from './refreshPanel.module.css';
import { useAppContext } from '@/app/context/app.context';
import { getEntrysJournal } from '@/app/service/reports/getEntrysJournal';
import { Button } from '../../common/button/Button';
import { Maindata } from '@/app/context/app.context.interfaces';
import DateIco from './date.svg'
import { dateNumberToString } from '@/app/service/common/converterForDates';

export const RefreshPanel = ({className, ...props }: RefreshPanelProps) :JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const {dateStart, dateEnd} = mainData.interval;

    const refreshReport = async (mainData: Maindata, setMainData: Function | undefined) => {
        setMainData && setMainData('updateDataForDocumentJournal', true)
        getEntrysJournal(setMainData, mainData);
    }
    
    useEffect(()=> {
        
    }, [])
    
    let dateStartInStr = dateNumberToString(dateStart)
    let dateEndInStr = dateNumberToString(dateEnd)
    return (
       <>
            <div className={styles.btnBox}>
                {
                    <div>{`оралик сана: ${dateStartInStr} дан ${dateEndInStr} гача`}</div>
                }
                <DateIco 
                    className={styles.ico}
                    onClick={(mainData: Maindata) => {
                        if (setMainData) {
                            setMainData('showIntervalWindow', true);
                            }
                        }}
                />
                <Button appearance='ghost' onClick={(e) => refreshReport(mainData, setMainData)}>Янгилаш</Button>
            </div>
       </>
    )
} 