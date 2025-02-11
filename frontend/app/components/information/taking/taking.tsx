'use client'
import styles from './taking.module.css';
import { TakingItem } from './takingItem/takingItem';
import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { Schet, TypeQuery } from '@/app/interfaces/report.interface';
import { useAppContext } from '@/app/context/app.context';
import { numberValue } from '@/app/service/common/converters';
import { queryKor } from '@/app/service/reports/querys/queryKor';
import { dateNumberToString } from '@/app/service/common/converterForDates';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import useSWR from 'swr';
import { TakingProps } from './taking.props';
import { useState } from 'react';

export const Taking = ({className, data, currentSection, ...props }: TakingProps) :JSX.Element => {
    const {mainData, setMainData} = useAppContext()

    const {dateStart, dateEnd} = mainData.interval;
    let dateStartForUrl = dateStart
    let dateEndForUrl = dateEnd

    if (!dateStart && !dateEnd) {
        let now = Date.now()+18000000
        let nowInstr = dateNumberToString(now)
        dateStartForUrl = Date.parse(nowInstr)
        dateEndForUrl = Date.parse(nowInstr) + 86399999
    }
    

    const { contentName, user, showDocumentWindow } = mainData;
    const role = mainData.user?.role;
    const token = user?.access_token;

    let url = process.env.NEXT_PUBLIC_DOMAIN+'/api/hamir/byTypeForDate'+'?documentType='+contentName+'&dateStart='+dateStartForUrl+'&dateEnd='+dateEndForUrl;
    
    const { data : hamirs, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    // const OBSUMD5050 = queryKor(Schet.S50, Schet.S50, TypeQuery.ODS, undefined, undefined, mainData, true);
    // const OBSUMK5050 = queryKor(Schet.S50, Schet.S50, TypeQuery.OKS, undefined, undefined, mainData, true);
    let [show, setShow] = useState<boolean>(false);
    
    return (
       <>
            <div className={styles.title}>
                {'ЦЕХ ВА ЮК ЕТКАЗИБ БЕРУВЧИЛАР ТОПШИРГАН ПУЛЛАРИ'}
                <button 
                    className={styles.button}
                    onClick={()=> setShow(value => !value)}>
                        OK
                </button>    
            </div>
            {
                show &&
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <td>Булим</td>
                            <td>Топширган пули</td>
                        </tr>
                    </thead>
                    
                    {
                        data && data.length > 0 &&
                        data.filter((item: any) => {
                            return (item.filial)
                        })
                        .map((item: ReferenceModel, key: number) => {
                            return <TakingItem key={key} currentId= {item._id} data={data} hamirs = {hamirs} title={item.name}/>
                        })
                    }    
                
                    {/* <thead>
                        <tr>
                            <td>Жами</td>
                            <td>-</td>
                        </tr>
                    </thead> */}
                    
                </table>
            }
            
       </>
    )
} 