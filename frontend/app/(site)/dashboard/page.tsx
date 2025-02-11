'use client'
import { Htag } from '@/app/components';
import styles from './page.module.css';
import ReportWindow from '@/app/components/reports/reportWindow/reportWindow';
import ReferenceJournal from '@/app/components/journals/referenceJournal/referenceJournal';
import { useAppContext } from '@/app/context/app.context';
import { Message } from '@/app/components/common/message/message';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Journal from '@/app/components/journals/journal/journal';
import { IntervalWindow } from '@/app/components/common/intervalWindow/intervalWindow';
import TopBox from '@/app/components/common/topBox/topBox';
import { Information } from '@/app/components/information/information';
import { Spinner } from '@/app/components/common/spinner/spinner';
import { Inform } from '@/app/components/inform/inform';
import UserJournal from '@/app/components/journals/userJournal/userJournal';

export default function Dashboard() {

  const {mainData} = useAppContext()
  const {contentType, contentTitle} = mainData
  
  useEffect(() => {
    if (mainData.user == undefined) {
      redirect('/');
    }
  }, [mainData.user]);

  return (
    
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <TopBox/>
        <div className={styles.content}>

          {/* {mainData.mainPage && <Information/>} */}
          {mainData.mainPage && <Inform/>}
          
          <div className={styles.journalBox}>
            { !mainData.mainPage && contentType=='document' && <Journal/> }
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
      </div>
      <Message/>
    </div>
  )
}
