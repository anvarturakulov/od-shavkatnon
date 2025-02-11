'use client'
import { InformationProps } from './information.props';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { Section } from './section/section';
import { Cash } from './cash/cash';
import { RefreshPanel } from './refreshPanel/refreshPanel';
import { Sklad } from './sklad/sklad';
import { Production } from './production/production';
import { Zp } from './zp/zp';
import { UserRoles } from '@/app/interfaces/general.interface';
import { Taking } from './taking/taking';
import { Foyda } from './foyda/foyda';
import { Norma } from './norma/norma';

export const Information = ({className, ...props }: InformationProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData;
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/getAll/';
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    return (
       <>
            <RefreshPanel/>
            {
                user?.role != UserRoles.ZAMGLBUX &&
                <>
                    <Cash data={data}/>
                    {
                        !mainData.loading &&
                        <>
                            <Taking data={data} />
                            <Section data={data} sectionType='buxgalter'/>
                            <Section data={data} sectionType='filial'/>
                            <Section data={data} sectionType='delivery'/>
                            <Sklad data={data} sectionType='sklad'/>
                            <Production data={data} />
                            <Zp data={data}/>
                            <Foyda data={data}/>
                            <Norma data={data}/>    
                        </>
                    }
                    
                </>
            }

            {
                user?.role == UserRoles.ZAMGLBUX &&
                <>
                    <Section data={data} sectionType='buxgalter' currentSection={user.storageId}/>
                    <Sklad data={data} sectionType='sklad'/>
                </>

            }
            

       </>
    )
} 