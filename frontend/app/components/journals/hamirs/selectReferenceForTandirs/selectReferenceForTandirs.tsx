import { SelectReferenceForTandirsProps } from './selectReferenceForTandirs.props';
import styles from './selectReferenceForTandirs.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';

export const SelectReferenceForTandirs = ({ idForSelect, currentItemId, disabled, className, ...props }: SelectReferenceForTandirsProps): JSX.Element => {

    const {mainData, setMainData} = useAppContext();
    const { user } = mainData;
    const token = user?.access_token;
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
                    return item.typeTMZ == 'PRODUCT'
                })
                .sort(sortByName)
                .filter((item:ReferenceModel) => !item.deleted)
                .map((item:ReferenceModel, key:number) => (
                    <>
                        <option 
                            value={item.name}
                            data-type={item.typeReference}
                            data-id={item._id}
                            selected={item._id == currentItemId}
                            >
                                {item.name}
                        </option>
                    </>
                ))}
            </select>
        </div>
    );
};