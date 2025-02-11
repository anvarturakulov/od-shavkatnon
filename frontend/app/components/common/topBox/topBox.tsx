'use client'
import styles from './topBox.module.css'
import cn from 'classnames';
import {TopBoxProps} from './topBox.props';
import Menu from '../../menu/menu';
import { Htag } from '../htag/Htag';
import { useAppContext } from '@/app/context/app.context';
import User from './userTopBox/userTopBox';
import { UserRoles, dashboardUsersList } from '@/app/interfaces/general.interface';

export default function TopBox({className, ...props}:TopBoxProps):JSX.Element {
    
  const {mainData} = useAppContext()
  const showMenu = mainData.user && dashboardUsersList.includes(mainData.user?.role)
  
  return (
    <div className={cn(styles.topBox, {[styles.topBoxMini] : !showMenu})}>
      {showMenu && <Menu/>}
      <div className={styles.logo}>
       OSON DASTUR - (NEW VERSION) : <span>ишлаб чикаришни онлайн бошкаринг</span>
      </div>
      <User/>
    </div>
  )
}
