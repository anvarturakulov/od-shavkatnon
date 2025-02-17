import { SelectReferenceProps } from './selectReference.props';
import styles from './selectReference.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { UserRoles } from '@/app/interfaces/general.interface';

export const SelectReference = ({ label, visible, typeReference , className, ...props }: SelectReferenceProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData;
    const token = user?.access_token;
    
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/'+typeReference;
    
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata) => {
        
        let target = e.currentTarget;
        let id = target[target.selectedIndex].getAttribute('data-id')
        
        let {reportOption} = mainData;
        
        let newObj = {
            ...reportOption,
            [target.id]: id,
        }
        
        if (setMainData) {
            setMainData('reportOption', {...newObj})
        }
        
    }
    
    if (visible == false) return <></>
    
    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <select
                className={styles.select}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData)}
            >   
                <>
                    <option 
                        value={'NotSelected'} 
                        data-type={null} 
                        data-id={null}
                        className={styles.chooseMe}
                        >{'Тангланг =>>>>'}</option>
                </>
                {
                    data && data.length>0 && data
                    .filter((item: ReferenceModel) => {
                        if (item.typeReference == TypeReference.STORAGES) {
                            if ( user?.role == UserRoles.GLBUX && item.director) return false
                            if ( item.deleted) return false
                            if ( item.buxgalter || item.delivery || item.sklad || item.filial) return true
                            else return false
                        }

                        return true
                    })
                    .sort(sortByName)
                    .map((item:ReferenceModel, key:number) => (
                    <>
                        <option 
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
