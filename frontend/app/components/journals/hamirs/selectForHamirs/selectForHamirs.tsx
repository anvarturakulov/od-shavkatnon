import { SelectForHamirsProps } from './selectForHamirs.props';
import styles from './selectForHamirs.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';

export const SelectForHamirs = ({ label , className, ...props }: SelectForHamirsProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { user, contentName } = mainData;
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/'+TypeReference.STORAGES;
    const { data , mutate } = useSWR(url, (url) => getDataForSwr(url, token));

    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata) => {
        let target = e.currentTarget;
        let currentId = target[target.selectedIndex].getAttribute('data-id');
        if ( setMainData ) {
            setMainData('currentStorageIdInHamirsJournal', currentId)
        }
    }
        
    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <select
                className={cn(styles.select)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData)}
            >   
                <>
                    <option 
                        value={'NotSelected'} 
                        data-type={null} 
                        data-id={null}
                        className={styles.chooseMe}
                        selected = {true}
                        
                        >{'=>'}</option>
                </>
                {data && data.length>0  &&
                data
                .filter((item: ReferenceModel) => {
                    return (item.filial == true) 
                })
                .sort(sortByName)
                .filter(( item:ReferenceModel ) => !item.deleted )
                .map(( item:ReferenceModel ) => (
                    <>
                        <option 
                            className={styles.option}
                            key = {item._id}
                            value={item.name}
                            data-type={item.typeReference} 
                            data-id={item._id}
                            >
                                {item.name}
                        </option>  
                    </>
                ))}
            </select>
        </div>
    );
};
