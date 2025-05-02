import { SelectReferenceInFormProps, TypeForSelectInForm } from './selectReferenceInForm.props';
import styles from './selectReferenceInForm.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { ReferenceModel, TypePartners, TypeReference, TypeSECTION, TypeTMZ } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { getTypeDocumentForReference } from '@/app/service/documents/getTypeDocumentForReference';
import { DocumentType } from '@/app/interfaces/document.interface';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { docsDependentToBalance, docsDependentToMiddlePrice } from '../../doc/helpers/documentTypes';
import { UserRoles } from '@/app/interfaces/user.interface';
import { useEffect, useState } from 'react';
import { reciever } from './query/reciever';
import { sender } from './query/sender';
import { analitic } from './query/analitic';
import { productForCharge } from './query/productForCharge';

export const SelectReferenceInForm = ({ label, typeReference, visibile=true , definedItemId ,currentItemId, type, maydaSavdo, className, ...props }: SelectReferenceInFormProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const { contentName } = mainData.window;
    const {  currentDocument } = mainData.document;
    const token = user?.token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/byType/'+typeReference;
    const { data } = useSWR(url, (url) => getDataForSwr(url, token));

    const [selected, setSelected] = useState('');
        
    useEffect(()=> {
        if (data && data.length>0) {
            const initialValue = data[data.findIndex((elem: ReferenceModel) => 
                (
                    elem?.id == definedItemId || 
                    elem?.id == currentItemId 
                ))]?.name || 'NotSelected'
            setSelected(initialValue)
        }
    }, [data, currentItemId, definedItemId])

    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata, type: TypeForSelectInForm, maydaSavdo: boolean | undefined) => {
        
        const { user } = mainData.users;
        const { contentName } = mainData.window;
        const {  currentDocument } = mainData.document;
        let role = user?.role;
        
        if (currentDocument) {
            let target = e.currentTarget;
            let currentItem = {...currentDocument};
            let idStr = target[target.selectedIndex].getAttribute('data-id');
            let id:number = 0
            if (idStr) id = +idStr

            if (type == 'sender' && id) {
                currentItem.docValues.senderId = id
                if (docsDependentToBalance.includes(contentName)) currentItem.docValues.balance = 0;
                if (docsDependentToMiddlePrice.includes(contentName)) currentItem.docValues.price = 0;
            }
            if (type == 'receiver' && id) currentItem.docValues.receiverId = id;

            if (type == 'productForCharge' && id) currentItem.docValues.productForChargeId = id;
              
            if (type == 'analitic' && id) {
                currentItem.docValues.analiticId = id

                if (docsDependentToBalance.includes(contentName)) currentItem.docValues.balance = 0;
                if (docsDependentToMiddlePrice.includes(contentName)) currentItem.docValues.price = 0;

                if (user?.role == UserRoles.DELIVERY) {
                    let price = getPropertySubconto(data, id).refValues.firstPrice
                    
                    if (price) {
                        currentItem.docValues.price = price
                        currentItem.docValues.total = price * currentItem.docValues.count
                    }
                }

                if (maydaSavdo) {
                    let price = getPropertySubconto(data, id).refValues.thirdPrice
                    if (price) {
                        currentItem.docValues.price = price
                        currentItem.docValues.total = price * currentItem.docValues.count
                    }
                }
            }
            if ( setMainData ) {
                setMainData('currentDocument', {...currentItem})
            }
        }
        
    }
    
    if (!visibile) return <></>

    let typeDocumentForReference = getTypeDocumentForReference(contentName);
    let flagDisabled = Boolean(definedItemId)

    if ( user?.role == UserRoles.GLBUX && 
        currentDocument.documentType == DocumentType.ComeProduct
    ) {
        flagDisabled = false
    }
 
    if (type == 'sender' && contentName == DocumentType.ServicesFromPartners) currentItemId = 0

    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <select
                className={cn(styles.select)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData, type, maydaSavdo)}
                disabled = { flagDisabled }
                value={selected}
            >   
                    <option 
                        value={'NotSelected'} 
                        data-type={null} 
                        data-id={null}
                        className={styles.chooseMe}
                        // selected = {true}
                        key= {-1}
                        >{'=>'}
                    </option>
                {data && data.length>0  &&
                data
                .filter((item:ReferenceModel) => {
                    if (typeReference == TypeReference.TMZ && type != 'productForCharge' ) {
                        switch (typeDocumentForReference) {
                            case 'MATERIAL':
                                return item.refValues?.typeTMZ == 'MATERIAL'
                            case 'PRODUCT':
                                return item.refValues?.typeTMZ == 'PRODUCT'
                            case 'HALFSTUFF':
                                return item.refValues?.typeTMZ == 'HALFSTUFF'
                            case 'OTHER':
                                return true
                        }
                    } else {
                        return true
                    }
                })
                
                .filter((item: ReferenceModel) => {
                    return (
                        reciever(item, type, contentName, typeReference, mainData) ||
                        sender(item, type, contentName, typeReference, mainData) ||
                        analitic(item, type, contentName, typeReference, mainData) ||
                        productForCharge(item, type, contentName, typeReference, mainData)
                    )
                })
                
                .sort(sortByName)
                .filter(( item:ReferenceModel ) => !item.refValues?.markToDeleted )
                .map(( item:ReferenceModel ) => (
                    <option 
                        className={styles.option}
                        key = {item.id}
                        value={item.name}
                        data-type={item.typeReference} 
                        data-id={item.id}>
                            {item.name}
                    </option>  
                ))}
            </select>
        </div>
    );
};
