import { SelectReferenceInTableProps } from './selectReferenceInTable.props';
import styles from './selectReferenceInTable.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { Maindata } from '@/app/context/app.context.interfaces';
import { sortByName } from '@/app/service/references/sortByName';

export const SelectReferenceInTable = ({  selectForReciever , typeReference, itemIndexInTable, currentItemId, className, ...props }: SelectReferenceInTableProps): JSX.Element => {

    const {mainData, setMainData} = useAppContext();
    const { contentName } = mainData.window;
    const { user } = mainData.users;

    const token = user?.token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/'+typeReference;
    
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));
    
    const changeElements = (e: React.FormEvent<HTMLSelectElement>, itemIndex: number, setMainData: Function | undefined, mainData: Maindata) => {
        let target = e.currentTarget;
        let {currentDocument } = mainData.document;
        let {contentName} = mainData.window;

        if (currentDocument && currentDocument.docTableItems) {
            
            let currentItem = {...currentDocument.docTableItems[itemIndex]};
            let strId = target[target.selectedIndex].getAttribute('data-id');
            let id: number = 0
            if (strId) id = +strId
            let value = target.value;

            if (id != null) {
                currentItem.referenceId = id
            } else {
                currentItem.referenceId = 0                
            }

            let newItems = [...currentDocument.docTableItems]
            newItems[itemIndex] = {...currentItem}
            let newObj = {
                ...currentDocument,
                docTableItems: [...newItems]
            }
            
            if ( setMainData ) {
                setMainData('currentDocument', {...newObj})
            }
        }
    }

    return (
        <div className={styles.box}>
            <select
                className={styles.select}
                onChange={(e) => changeElements(e, itemIndexInTable, setMainData, mainData)}
                {...props}
            >
                <option 
                    value={'NotSelected'}
                    data-type={null}
                    data-id={null}
                    selected={true}
                    className={styles.chooseMe}
                >
                    {'Тангланг =>>>>'}
                </option>

                {data && data.length>0 && 
                data?.filter((item:ReferenceModel) => {
                    return item.refValues.typeTMZ == 'MATERIAL'
                })
                .sort(sortByName)
                .filter((item:ReferenceModel) => !item.refValues.markToDeleted)
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