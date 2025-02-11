'use client'
import styles from './page.module.css'
import cn from 'classnames';
import TopBox from '@/app/components/common/topBox/topBox';
import { MenuData } from '@/app/data/menu';
import { useAppContext } from '@/app/context/app.context';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import UserMenu from '@/app/components/userMenu/userMenu';
import ReportWindow from '@/app/components/reports/reportWindow/reportWindow';
import Journal from '@/app/components/journals/journal/journal';
import { Message } from '@/app/components/common/message/message';
import { UserRoles } from '@/app/interfaces/general.interface';
import Hamirs from '@/app/components/journals/hamirs/hamirs';
import { DefinedTandirWorkers } from '@/app/components/documents/definedTandirWorkers/definedTandirWorkers';

export default function Users() {
  
  const {mainData, setMainData} = useAppContext();
  const {contentType, contentTitle, user} = mainData;
  const [tandirworkers, setTandirWorkers] = useState<boolean>(false);

  useEffect(() => {
    if (mainData.user == undefined) {
      redirect('/');
    }
  }, [mainData.user]);

  return (
    <>
      <div className={styles.container}>
        {
          mainData.mainPage &&
          <TopBox/>
        }
        
        {
          mainData.mainPage &&
          (
            user?.role != UserRoles.TANDIR && 
            user?.role != UserRoles.HAMIRCHI 
          ) && 
            <div className={styles.box}>
              <UserMenu menuData={MenuData}/>
            </div>
        }
        
        {
          mainData.mainPage &&
          ( user?.role == UserRoles.HAMIRCHI ||
            user?.role == UserRoles.TANDIR ) 
          &&
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
            { !mainData.mainPage && contentType=='document' && <Journal/> }
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
