'use client'
import styles from './menuItems.module.css'
import cn from 'classnames';
import {MenuItemsProps} from './menuItems.props'
import { useEffect, useState } from 'react';
import { MenuItem } from '../../../interfaces/menu.interface';
import { ContentType } from '../../../interfaces/general.interface';
import { useAppContext } from '@/app/context/app.context';
import { defaultDocumentFormItems, defaultReportOptions } from '@/app/context/app.context.constants';
import { getKeyEnum } from '@/app/service/common/getKeyEnum';
import { ReportOptions } from '@/app/interfaces/report.interface';

export default function MenuItems({menuData, className, ...props}:MenuItemsProps):JSX.Element {
    
    const [menu, setMenu] = useState<Array<MenuItem>>([])
    
    const {mainData, setMainData} = useAppContext()
    const role = mainData.user?.role;

    const onClickItem = (e:any,currentTitle:string) => {
        let newMenu = [...menu]
        newMenu.map(item => {
            if (item.title == currentTitle) {
                return item.isOpened = !item.isOpened
            }
        })
        
        setMenu(newMenu)
    }

    const onClickSubItem = (contentName: string, contentTitle: string, contentType: ContentType) => {
        const keyItem = getKeyEnum(contentName, contentType)
        
        if (setMainData) {
            setMainData('activeMenuKey', keyItem);
            setMainData('contentType', contentType);
            setMainData('contentTitle', contentTitle);
            setMainData('contentName', contentName);
            setMainData('mainPage', false);
            setMainData('showReferenceWindow', false);
            setMainData('isNewReference', false);
            setMainData('showDocumentWindow', false);
            setMainData('isNewDocument', false);
            setMainData('clearControlElements', true);

            if (contentType == 'document') {
                let defValue = {...defaultDocumentFormItems} 
                defValue.documentType = contentName
                setMainData('currentDocument', {...defValue});
            }

            if (contentType == 'report') {
                let defValue = {...defaultReportOptions};
                const newReportOptions:ReportOptions = {
                    ...defValue,
                    startReport: false,
                }
                setMainData('reportOption', { ...newReportOptions });

            }
        };
    }

    useEffect(()=> {
       setMenu(menuData) 
    },[menuData])

    return (
        <>
            {menu.map((item, i) => (
                <>
                    <ul className={styles.ul}>
                        <li
                            className={cn(styles.item)}
                            onClick={(e)=>onClickItem(e,item.title)}
                            key={i}
                            data-type = {'firstLevel'}
                        >
                            {item.title}
                        </li>
                        {item.subMenu.length && (
                            item.subMenu.map((elem,k)=> (
                                <>
                                {  role && elem.roles.includes(role) &&
                                    <li 
                                        className={cn(styles.subItem, {
                                            [styles.isOpened]: item.isOpened
                                        })
                                    }
                                        onClick={() => onClickSubItem(elem.title, elem.description, elem.type)}
                                        key={elem.title}
                                    >
                                        {elem.description? elem.description : elem.title}
                                    </li>
                                }
                                </>
                            ))
                        )}
                    </ul>
                </>
                
            ))}
        </>
    )
}