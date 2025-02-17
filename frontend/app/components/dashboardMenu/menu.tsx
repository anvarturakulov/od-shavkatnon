'use client'
import styles from './menu.module.css'
import {MenuProps} from './menu.props';
import IcoHome from './ico/home.svg';
import { MenuData } from '@/app/data/menu';
import MenuItems from './menuItems/menuItems';
import { useAppContext } from '@/app/context/app.context';
import { Maindata } from '@/app/context/app.context.interfaces';

export default function Menu({className, ...props}:MenuProps):JSX.Element {
    const {mainData, setMainData} = useAppContext()
    const goToMainPage = (setMainData: Function| undefined, mainData: Maindata) => {
      setMainData && setMainData('mainPage', true)
    }
    return (
        <>
           <div className={styles.menu}>
            <div className={styles.menuBtn} onClick={() => goToMainPage(setMainData, mainData)}>
              <IcoHome className={styles.icoHome}/>
              Меню
            </div>
            <div className={styles.menuItems}>
              <MenuItems menuData={MenuData}/>
            </div>
          </div>
        </>
    )
}
