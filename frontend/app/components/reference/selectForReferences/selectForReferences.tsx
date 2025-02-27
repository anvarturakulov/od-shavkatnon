'use client'
import { SelectForReferencesProps } from './selectForReferences.props';
import styles from './selectForReferences.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { ReferenceModel, TypeReference, TypeSECTION } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { useEffect, useState } from 'react';

export const SelectForReferences = ({ label, typeReference ,currentItemId, setClientForSectionId, className, ...props }: SelectForReferencesProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const token = user?.token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/byType/'+typeReference;
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));

    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata) => {
        let target = e.currentTarget;
        let id = target[target.selectedIndex].getAttribute('data-id');
        setClientForSectionId(id)
    }

    const [selected, setSelected] = useState('');
    
    useEffect(()=> {
        if (data && data.length>0) {
            const initialValue = data[data.findIndex((elem: ReferenceModel) => elem?.id == currentItemId)]?.name
            setSelected(initialValue)
        }
    }, [data])
    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <select
                className={cn(styles.select)}
                value={selected}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData)}
            >   
                <option 
                    value={'NotSelected'} 
                    data-type={null} 
                    data-id={null}
                    className={styles.chooseMe}
                    key = {-1}
                    >{'=>'}
                </option>
                {data && data.length>0  &&
                data
                .filter((item: ReferenceModel)=> {
                    return ( item.refValues.typeSection == TypeSECTION.DELIVERY || item.refValues.typeSection == TypeSECTION.FILIAL)
                })
                .sort(sortByName)
                .filter(( item:ReferenceModel ) => !item.refValues.markToDeleted )
                .map(( item:ReferenceModel ) => {
                    return (
                    <option 
                        className={styles.option}
                        key = {item.id}
                        value={item.name}
                        data-type={item.typeReference} 
                        data-id={item.id}
                        >
                            {item.name}
                    </option>  
                )}
                )}
            </select>
        </div>
    );
};
