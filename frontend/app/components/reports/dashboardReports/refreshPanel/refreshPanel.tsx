'use client'
import { RefreshPanelProps } from './resfreshPanel.props';
import styles from './refreshPanel.module.css';
import { useAppContext } from '@/app/context/app.context';
import { Button } from '../../../common/button/Button';
import { Maindata } from '@/app/context/app.context.interfaces';
import DateIco from './date.svg'
import { dateNumberToString } from '@/app/service/common/converterForDates';
import { getInformation } from '@/app/service/reports/getInformation';
import axios from 'axios';
import { SelectReportType } from './selectReportType/selectReportType';

export const RefreshPanel = ({className, ...props }: RefreshPanelProps) :JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const {dateStart, dateEnd} = mainData.window.interval;
    const { user } = mainData.users

    const refreshReport = async (mainData: Maindata, setMainData: Function | undefined) => {
        let firstPrice:string|null = ''
        let secondPrice:string|null = ''

        if (mainData.report.dashboardCurrentReportType == 'Foyda') {
            firstPrice = prompt('Катта нон учун нархни киритинг')
            secondPrice = prompt('Оддий нон учун нархни киритинг')
            
        }
        getInformation(setMainData, mainData, firstPrice, secondPrice );
    }
    
    let dateStartInStr = dateNumberToString(dateStart)
    let dateEndInStr = dateNumberToString(dateEnd)
   
    const deleteDocs = () => {

        let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/document/forDate' +
        '?startDate=' + 0 + '&endDate=' + 1;

        const config = {
            headers: { Authorization: `Bearer ${user?.access_token}` }
        };

        let result = 0;
        axios.delete(url, config)
            .then(function (request) {
            result = +request.data

            })
            .catch(function (error) {});
    }

    return (
       <>
            <div className={styles.box}>
                <div className={styles.selectBox}>    
                    <SelectReportType/>
                    <DateIco 
                        className={styles.ico}
                        onClick={(mainData: Maindata) => {
                            if (setMainData) {
                                setMainData('showIntervalWindow', true);
                                }
                            }}
                    />
                </div>
                <div>{`Cана: ${dateStartInStr} дан ${dateEndInStr} гача`}</div>
                <Button className={styles.btn} appearance='ghost' onClick={(e) => refreshReport(mainData, setMainData)}>Янгилаш</Button>
            </div>
       </>
    )
} 