import { SelectReferenceForTandirsProps } from './selectReferenceForTandirs.props';
import styles from './selectReferenceForTandirs.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';

export const SelectReferenceForTandirs = ({ idForSelect, currentItemId, disabled, className, ...props }: SelectReferenceForTandirsProps): JSX.Element => {

    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const token = user?.token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/'+'TMZ';
    
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    return (
        <div className={styles.box}>
            <select
                className={styles.select}
                {...props}
                disabled = {disabled}
                id = {idForSelect}
            >
                {data && data.length>0 && 
                data?.filter((item:ReferenceModel) => {
                    return item.refValues?.typeTMZ == 'PRODUCT'
                })
                .sort(sortByName)
                .filter((item:ReferenceModel) => !item.refValues?.markToDeleted)
                .map((item:ReferenceModel, key:number) => (
                    <>
                        <option 
                            value={item.name}
                            data-type={item.typeReference}
                            data-id={item.id}
                            selected={item.id == currentItemId}
                            >
                                {item.name}
                        </option>
                    </>
                ))}
            </select>
        </div>
    );
};