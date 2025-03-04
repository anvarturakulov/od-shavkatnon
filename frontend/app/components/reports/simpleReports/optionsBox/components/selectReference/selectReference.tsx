import { SelectReferenceProps } from './selectReference.props';
import styles from './selectReference.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { ReferenceModel, TypeReference, TypeSECTION } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { UserRoles } from '@/app/interfaces/user.interface';

export const SelectReference = ({ label, visible, typeReference , className, ...props }: SelectReferenceProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const token = user?.token;
    
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/'+typeReference;
    
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata) => {
        
        let target = e.currentTarget;
        let id = target[target.selectedIndex].getAttribute('data-id')
        
        let {reportOption} = mainData.report;
        
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
                            if ( user?.role == UserRoles.GLBUX && item.refValues?.typeSection == TypeSECTION.DIRECTOR) return false
                            if ( item.refValues?.markToDeleted) return false
                            if ( 
                                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ||
                                item.refValues?.typeSection == TypeSECTION.DELIVERY ||
                                item.refValues?.typeSection == TypeSECTION.STORAGE ||
                                item.refValues?.typeSection == TypeSECTION.FILIAL
                            ) return true
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
                            data-id={item.id}    
                            >
                                {item.name}
                        </option>
                    </>
                ))}
            </select>
        </div>
    );
};
