import { SelectReferenceInFormProps } from './selectWorkers.props';
import styles from './selectWorkers.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { TandirWorkersType } from '../../selects/selectReferenceInForm/helper';

export const SelectWorkers = ({ label, currentItemId, type, visible, className, ...props }: SelectReferenceInFormProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/WORKERS';
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));

    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata, type: TandirWorkersType) => {
        const {definedTandirWorkers} = mainData.document
        if (mainData) {
            let target = e.currentTarget;
            let currentValue = {...definedTandirWorkers};
            let strId = target[target.selectedIndex].getAttribute('data-id');
            let id:number = 0   
            if (strId) id = +strId
            
            if (type == 'firstWorker') currentValue.firstWorker = id
            if (type == 'secondWorker') currentValue.secondWorker = id
            if (type == 'thirdWorker') currentValue.thirdWorker = id

            if ( setMainData ) {
                setMainData('definedTandirWorkers', {...currentValue})
            }
        }
        
    }
    if (!visible) return <></>

    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <select
                className={cn(styles.select)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData, type)}
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
                .sort(sortByName)
                .filter(( item:ReferenceModel ) => !item.refValues.markToDeleted )
                .map(( item:ReferenceModel ) => (
                    <>
                        <option 
                            className={styles.option}
                            key = {item.id}
                            value={item.name}
                            data-type={item.typeReference} 
                            data-id={item.id}
                            selected={ item.id == currentItemId } 
                            >
                                {item.name}
                        </option>  
                    </>
                ))}
            </select>
        </div>
    );
};
