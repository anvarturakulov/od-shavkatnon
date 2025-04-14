import { SelectReferenceForTandirsProps } from './selectReferenceForTandirs.props';
import styles from './selectReferenceForTandirs.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';

export const SelectReferenceForTandirs = ({ data, idForSelect, currentItemId, disabled, className, ...props }: SelectReferenceForTandirsProps): JSX.Element => {

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
                    <option 
                        value={item.name}
                        data-type={item.typeReference}
                        data-id={item.id}
                        selected={item.id == currentItemId}
                        >
                            {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
};