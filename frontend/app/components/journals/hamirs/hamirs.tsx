'use client'
import styles from './hamirs.module.css'
import { HamirsProps } from './hamirs.props'
import { useEffect } from 'react';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { HamirModel, SendingHamir } from '@/app/interfaces/hamir.interface';
import { createHamirsForDayByUser } from '@/app/service/documents/createHamirsForDayByUser';
import { Maindata } from '@/app/context/app.context.interfaces';
import { changeStatusHamir } from '@/app/service/documents/changeStatusHamir';
import { SelectReferenceForTandirs } from './selectReferenceForTandirs/selectReferenceForTandirs';
import { secondsToDateString } from '../../documents/document/doc/helpers/doc.functions';
import { UserRoles } from '@/app/interfaces/user.interface';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { TypeReference } from '@/app/interfaces/reference.interface';

export default function Hamirs({ className, ...props} : HamirsProps ):JSX.Element {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const userName = user?.name;
    let tandir = user?.role == UserRoles.TANDIR
    
    let dateNowPlussedInNumber = Date.now() + 32400000
    let dateNowPlussedInString = new Date(dateNowPlussedInNumber);
    let dateStr = dateNowPlussedInString.toISOString().split('T')[0]

    const token = user?.token;

    const documentType = DocumentType.ComeProduct
    const referenceType = TypeReference.TMZ

    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/documents/byTypeForDate'+'?documentType='+documentType+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    const { data : hamirs, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    const urlReferences = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/byType/'+referenceType;
    const { data : references, mutate: mutateReferences } = useSWR(urlReferences, (urlReferences) => getDataForSwr(urlReferences, token));

    useEffect(() => {
        mutate()
        setMainData && setMainData('updateHamirJournal', false);
    }, [mainData.journal.updateHamirJournal])

    const createHamirs = (date: number, userName: string | undefined, mainData: Maindata, setMainData: Function | undefined) => {
        
        let question = `Бугунги хамирларни тулдирайми`;

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

    const sendHamir = (e:React.FormEvent<HTMLButtonElement>, id: number | undefined, order: string | undefined, mainDate: Maindata, setMainData: Function | undefined) => {
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
            } else if 
                ( count > 0 && id && analiticId > 0 && 
                  confirm(`${order} - хамирдан тандирга ${count} та зувала бердингизми`)
                ) {
                    const hamir: SendingHamir = {
                        id,
                        analiticId,
                        count
                    }
                    
                    changeStatusHamir(hamir, mainData, setMainData)
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
                            .filter((item:DocumentModel, key: number) => {
                                return (item.userId == user?.id)
                            })
                            .filter((item:DocumentModel) => {
                                return (
                                    item.docValues.senderId == user?.sectionId
                                )
                            })
                            .sort((a:DocumentModel, b:DocumentModel) => {
                               if (a.docValues.comment && b.docValues.comment) {
                                return a.docValues.comment.localeCompare(b.docValues.comment)
                               }
                            })
                            .map((item:DocumentModel, key: number) => (
                                <tr 
                                    key={key} 
                                    className={cn(styles.trRow, {
                                            [styles.proveden]: item.docStatus == DocSTATUS.PROVEDEN,
                                            [styles.bigTr]: tandir
                                        })}>
                                    <td className={styles.date}>{secondsToDateString(item.date)}</td>
                                    <td className={styles.order}>{`-- ${item.docValues.comment} --` }</td>
                                    
                                    {
                                        tandir &&
                                        <td>
                                            <input 
                                                className={cn(styles.count, {
                                                    [styles.disabledInput]: item.docStatus == DocSTATUS.PROVEDEN
                                                })} 
                                                type='number'
                                                value={item.docValues.count} 
                                                disabled={item.docStatus == DocSTATUS.PROVEDEN}
                                            />    
                                        </td>
                                    }
                                    <td> 
                                        <SelectReferenceForTandirs 
                                            data = {references}
                                            idForSelect={`#${item.docValues.comment}`} 
                                            currentItemId={item.docValues.analiticId} 
                                            disabled={item.docStatus == DocSTATUS.PROVEDEN}
                                        />
                                    </td>

                                    <td className={styles.action}>
                                        <button className={cn(styles.sendBtn, {
                                                            [styles.notVisible]: item.docStatus == DocSTATUS.PROVEDEN,
                                                            })}
                                                onClick={(e) => sendHamir(e, item.id, item.docValues.comment, mainData, setMainData)}
                                        >Жунатиш</button>
                                    </td>
                                </tr>
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
