'use client'
import { Htag } from '@/app/components';
import styles from './page.module.css';
import ReportWindow from '@/app/components/reports/simpleReports/reportWindow/reportWindow';
import ReferenceJournal from '@/app/components/journals/referenceJournal/referenceJournal';
import { useAppContext } from '@/app/context/app.context';
import { Message } from '@/app/components/common/message/message';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Journal from '@/app/components/journals/journal/journal';
import { IntervalWindow } from '@/app/components/common/intervalWindow/intervalWindow';
import TopBox from '@/app/components/common/topBox/topBox';
import { Inform } from '@/app/components/reports/dashboardReports/inform';
import UserJournal from '@/app/components/journals/userJournal/userJournal';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { DateWindow } from '@/app/components/common/dateWindow/dateWindow';
import { DuplicateWindow } from '@/app/components/common/duplicateWindow/duplicateWindow';

export default function Dashboard() {

  const {mainData, setMainData} = useAppContext()
  const { contentType, mainPage } = mainData.window
  const { user } = mainData.users

  const token = user?.token;
  let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/users/names/';
  const { data : usersName, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
  
  useEffect(() => {
    if (user == undefined) {
      redirect('/');
    }
  }, [user]);

  useEffect(() => {
    if (usersName && usersName.length>0) {
      setMainData && setMainData('usersName', usersName)
    }
  }, [usersName]);

  return (
    
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <TopBox/>
        <div className={styles.content}>

          {mainPage && <Inform/>}
          
          <div className={styles.journalBox}>
            { !mainPage && contentType=='document' && <Journal/> }
          </div>

          <div className={styles.journalBox}>
            { contentType=='reference' && <ReferenceJournal/> }
          </div>

          <div className={styles.journalBox}>
            { contentType=='servis' && <UserJournal/> }
          </div>

          <div className={styles.journalBox}>
            { 
              contentType == 'report' &&
              <ReportWindow />
            }
          </div>
        </div>
        <IntervalWindow/>
        <DateWindow/>
        <DuplicateWindow/>
      </div>
      <Message/>
    </div>
  )
}
