'use client'
import styles from './hamirs.module.css'
import { HamirsProps } from './hamirs.props'
import { useEffect } from 'react';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { HamirModel } from '@/app/interfaces/hamir.interface';
import { createHamirsForDayByUser } from '@/app/service/documents/createHamirsForDayByUser';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getNameReference } from '../helpers/journal.functions';
import { changeStatusHamir } from '@/app/service/documents/changeStatusHamir';
import { SelectReferenceForTandirs } from './selectReferenceForTandirs/selectReferenceForTandirs';
import { secondsToDateString } from '../../documents/document/doc/helpers/doc.functions';
import { UserRoles } from '@/app/interfaces/user.interface';
import { DocSTATUS } from '@/app/interfaces/document.interface';


export default function Hamirs({ className, ...props} : HamirsProps ):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const userName = user?.name;
    let tandir = user?.role == UserRoles.TANDIR
    
    let dateNowPlussedInNumber = Date.now() + 32400000
    let dateNowPlussedInString = new Date(dateNowPlussedInNumber);
    let dateStr = dateNowPlussedInString.toISOString().split('T')[0]

    const token = user?.token;
    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/hamir/getForDate/'+dateStr;
    const { data : hamirs, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/getAll';
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));

    useEffect(() => {
        mutate()
        setMainData && setMainData('updateHamirJournal', false);
    }, [mainData.journal.updateHamirJournal])

    const createHamirs = (date: number, userName: string | undefined, mainData: Maindata, setMainData: Function | undefined) => {
        const {firstWorker, secondWorker, thirdWorker} = mainData.document.definedTandirWorkers

        let question = `Бугунги хамирларни -
        ${getNameReference(references, firstWorker)},
        ${getNameReference(references, secondWorker)},
        ${getNameReference(references, thirdWorker)} 
        ларга тулдирайми. Бугунги ходимларни кейин узгартириш кийин`;

        if (date && userName) {
            if (user?.role == UserRoles.TANDIR) {
                if (!confirm(question)) return
            } 
            
            createHamirsForDayByUser(date, mainData, setMainData);
            setMainData && setMainData('updateHamirJournal', true);
        } 
    }

    const refresh = () => mutate()
    let visibilityFillBtn = true

    if (hamirs && hamirs.length) {
        visibilityFillBtn = !hamirs.filter((item: HamirModel)=> {
            return (
                    item.sectionId == user?.sectionId &&
                    item.user == user?.name
                )
        }).length
    }

    const sendHamir = (e:React.FormEvent<HTMLButtonElement>, item: HamirModel, mainDate: Maindata, setMainData: Function | undefined) => {
        const { user } = mainData.users;

        if (user?.role == UserRoles.TANDIR) {
            let target = e.currentTarget;
            let count = Number(target.parentNode?.parentNode?.querySelector('input')?.value);
            let select = target.parentNode?.parentNode?.querySelector('select')
            let selectedElement = select?.options[select.selectedIndex];

            let dataId = selectedElement?.getAttribute('data-id') || ''
            let analiticId: number = -1
            if (dataId) analiticId = +dataId

            if (count > 90) {
                alert('Сон хато киритилди')
            } else if ( count > 0 && analiticId > 0 && confirm(`${item.order} - хамирдан тандирга ${count} та зувала бердингизми`)) {
                item.zuvala = count;
                item.analiticId = analiticId;
                changeStatusHamir(item, mainData, setMainData)
                setMainData && setMainData('updateHamirJournal', true)
            }
        }

    }
    return (
        <>
            <div className={styles.title}>{`Хамирлар руйхати`}</div>
            {
                <div className={styles.container} >
                    <table className={styles.table}>
                        <thead className={cn(styles.thead, {
                            [styles.theadWithTandir]: tandir
                        })}>
                            <tr key='0' >
                                <th key='2' className={cn(styles.date,{
                                    [styles.width50]: tandir
                                })}>Сана</th>
                                <th key='4' className={styles.order}>Хамир тартиби</th>
                                <th key = '5'>Амал</th>
                                
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {hamirs && hamirs.length>0 && 
                            hamirs
                            .filter((item:HamirModel, key: number) => {
                                return (item.user == user?.name)
                            })
                            .filter((item:HamirModel) => {
                                return (
                                    item.sectionId == user?.sectionId
                                    &&
                                    item.user == user.name
                                )
                            })
                            .sort((a:HamirModel, b:HamirModel) => {
                               if (a.order && b.order) {
                                return a?.order - b?.order
                               }
                            })
                            .map((item:HamirModel, key: number) => (
                                <>
                                    <tr 
                                        key={key} 
                                        className={cn(styles.trRow, {
                                                [styles.proveden]: item.docStatus == DocSTATUS.PROVEDEN,
                                                [styles.bigTr]: tandir
                                            })}>
                                        <td className={styles.date}>{secondsToDateString(item.date)}</td>
                                        <td className={styles.order}>{`-- ${item.order} --` }</td>
                                       
                                        {
                                            tandir &&
                                            <td>
                                                <input className={cn(styles.count, {
                                                    [styles.disabledInput]: item.docStatus == DocSTATUS.PROVEDEN
                                                })} type='number'
                                                value={item.zuvala} disabled={item.docStatus == DocSTATUS.PROVEDEN}
                                                />    
                                            </td>
                                        }
                                        <td> 
                                            <SelectReferenceForTandirs idForSelect={`#${item.order}`} currentItemId={item.analiticId} disabled={item.docStatus == DocSTATUS.PROVEDEN}/>
                                        </td>

                                        <td className={styles.action}>
                                            <button className={cn(styles.sendBtn, {
                                                                [styles.notVisible]: item.docStatus == DocSTATUS.PROVEDEN,
                                                              })}
                                                    onClick={(e) => sendHamir(e, item, mainData, setMainData)}
                                            >Жунатиш</button>
                                        </td>
                                    </tr>
                                </>    
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            <div className={styles.box}>
                {
                    visibilityFillBtn &&
                    <button className={styles.button} onClick={() => createHamirs(dateNowPlussedInNumber, userName, mainData, setMainData)}>Янги кун учун тулдириш</button>
                }
                <button className={styles.button} onClick={refresh}>Янгилаш</button>
            </div>
       
        </>
    )
}
