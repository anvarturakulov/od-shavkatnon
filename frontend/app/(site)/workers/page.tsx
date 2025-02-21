'use client'
import styles from './page.module.css'
import cn from 'classnames';
import TopBox from '@/app/components/common/topBox/topBox';
import { MenuData } from '@/app/data/menu';
import { useAppContext } from '@/app/context/app.context';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import UserMenu from '@/app/components/menu/workersMenu/workersMenu';
import ReportWindow from '@/app/components/reports/simpleReports/reportWindow/reportWindow';
import Journal from '@/app/components/journals/journal/journal';
import { Message } from '@/app/components/common/message/message';
import Hamirs from '@/app/components/journals/hamirs/hamirs';
import { UserRoles } from '@/app/interfaces/user.interface';
import { DefinedTandirWorkers } from '@/app/components/documents/document/definedTandirWorkers/definedTandirWorkers';

export default function Users() {
  
  const {mainData, setMainData} = useAppContext();
  const { contentType, mainPage } = mainData.window;
  const { user } = mainData.users;
  const [tandirworkers, setTandirWorkers] = useState<boolean>(false);

  useEffect(() => {
    if (user == undefined) {
      redirect('/');
    }
  }, [user]);

  return (
    <>
      <div className={styles.container}>
        {
          mainData.window.mainPage &&
          <TopBox/>
        }
        
        {
          mainData.window.mainPage &&
          (
            user?.role != UserRoles.TANDIR 
          ) && 
            <div className={styles.box}>
              <UserMenu menuData={MenuData}/>
            </div>
        }
        
        {
          mainData.window.mainPage && user?.role == UserRoles.TANDIR &&
          <>
            <Hamirs/>
            <button className={styles.btnForTandir} onClick={()=> setTandirWorkers(state => !state)}>Бугунги ходимлар руйхати</button>
          </>
        }

        {
            tandirworkers &&
            <DefinedTandirWorkers/>
        }

        <div className={styles.journalBox}>
            { !mainPage && contentType=='document' && <Journal/> }
        </div>

        <div className={styles.journalBox}>
          { 
            contentType == 'report' &&
            <ReportWindow />
          }
        </div>
      <Message/>
      </div>
    </>
  )
}
