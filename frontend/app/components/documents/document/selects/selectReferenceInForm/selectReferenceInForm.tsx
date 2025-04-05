import { SelectReferenceInFormProps, TypeForSelectInForm } from './selectReferenceInForm.props';
import styles from './selectReferenceInForm.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { ReferenceModel, TypePartners, TypeReference, TypeSECTION } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { getTypeDocumentForReference } from '@/app/service/documents/getTypeDocumentForReference';
import { DocumentType } from '@/app/interfaces/document.interface';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { definedTandirWorkers } from './helper';
import { docsDependentToBalance, docsDependentToMiddlePrice } from '../../doc/helpers/documentTypes';
import { UserRoles } from '@/app/interfaces/user.interface';
import { useEffect, useState } from 'react';


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
                console.log('initialValue', initialValue, type)
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
                    console.log(price)
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
    
    if (visibile == false) return <></>

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
                    if (typeReference == TypeReference.TMZ) {
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
                    if ((type == 'receiver' || type == 'sender') &&
                        ( contentName == DocumentType.MoveProd ))
                        {
                            return ( 
                                item.refValues?.typeSection == TypeSECTION.FILIAL  ||
                                item.refValues?.typeSection == TypeSECTION.DELIVERY || 
                                item.refValues?.typeSection == TypeSECTION.STORAGE 
                            ) 
                        }
                    
                    if ((type == 'receiver' || type == 'sender') && 
                         ( contentName == DocumentType.MoveHalfstuff || 
                           contentName == DocumentType.MoveMaterial ||
                           contentName == DocumentType.ComeHalfstuff ||
                           contentName == DocumentType.ComeProduct ))
                        {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL  || 
                                item.refValues?.typeSection == TypeSECTION.STORAGE
                            ) 
                        }
                    
                    if ((type == 'receiver') && 
                        contentName == DocumentType.LeaveCash) {
                        if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL || 
                                item.refValues?.typeSection == TypeSECTION.FOUNDER ||
                                item.refValues?.typeSection == TypeSECTION.COMMON || 
                                item.refValues?.typeSection == TypeSECTION.DIRECTOR
                            ) 
                        } else if (user?.role == UserRoles.GLBUX || user?.role == UserRoles.ZAMGLBUX) {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.COMMON 
                            )
                        } else {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL || 
                                item.refValues?.typeSection == TypeSECTION.STORAGE || 
                                item.refValues?.typeSection == TypeSECTION.DELIVERY || 
                                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT || 
                                item.refValues?.typeSection == TypeSECTION.COMMON
                            )
                        }
                    }

                    if (type == 'receiver' && contentName == DocumentType.TakeProfit) {
                        return (item.refValues?.typeSection == TypeSECTION.FOUNDER)
                    }

                    if ((type == 'sender') && 
                        contentName == DocumentType.LeaveCash) {
                        if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                          return (
                            item.refValues?.typeSection == TypeSECTION.FILIAL ||
                            item.refValues?.typeSection == TypeSECTION.ACCOUNTANT || 
                            item.refValues?.typeSection == TypeSECTION.FOUNDER ||
                            item.refValues?.typeSection == TypeSECTION.DIRECTOR
                        ) 
                        } 
                    }

                    if ((type == 'sender' || type == 'receiver') && 
                        contentName == DocumentType.MoveCash) {
                        if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.STORAGE ||
                                item.refValues?.typeSection == TypeSECTION.DELIVERY ||
                                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT  ||
                                item.refValues?.typeSection == TypeSECTION.FOUNDER
                            ) 
                        } else if (user?.role == UserRoles.GLBUX) {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.STORAGE ||
                                item.refValues?.typeSection == TypeSECTION.DELIVERY ||
                                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ||
                                item.refValues?.typeSection == TypeSECTION.DIRECTOR
                            )
                        } else {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.STORAGE ||
                                item.refValues?.typeSection == TypeSECTION.DELIVERY ||
                                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ||
                                item.refValues?.typeSection == TypeSECTION.DIRECTOR
                            )
                        }
                    }

                    if (type == 'receiver' && contentName == DocumentType.ZpCalculate)
                        {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.COMMON
                            ) 
                        }
                    
                    if (type == 'receiver' && contentName == DocumentType.ServicesFromPartners)
                        {
                            return item.refValues?.typeSection == TypeSECTION.FILIAL 
                        }

                    if (type == 'receiver' && contentName == DocumentType.ComeCashFromPartners)
                        {
                            if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                              return (
                                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ||
                                item.refValues?.typeSection == TypeSECTION.FOUNDER
                            ) 
                            } 
                            return ( item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ) 
                        }

                    if (type == 'receiver' && contentName == DocumentType.ComeMaterial)
                        {
                            return ( 
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.STORAGE
                            ) 
                        }
                    
                    if (type == 'sender' && 
                        ( contentName == DocumentType.LeaveMaterial || 
                          contentName == DocumentType.LeaveHalfstuff || 
                          contentName == DocumentType.LeaveProd ||
                          contentName == DocumentType.SaleMaterial
                        ))
                        {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.STORAGE
                            ) 
                        }
                    
                    if ( type == 'sender' && contentName == DocumentType.SaleProd) 
                        {
                            return (
                                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                                item.refValues?.typeSection == TypeSECTION.DELIVERY
                            ) 
                        }

                    if (type == 'sender' && ( contentName == DocumentType.ComeMaterial || contentName == DocumentType.ComeCashFromPartners || 
                        contentName == DocumentType.ComeProductImport )) {
                        return ( item.refValues?.typePartners == TypePartners.SUPPLIERS ) 
                    }

                    if (type == 'receiver' && contentName == DocumentType.SaleHalfStuff ) {
                        return ( item.refValues?.typePartners == TypePartners.SUPPLIERS ) 
                    }

                    if (type == 'sender' && typeReference == TypeReference.CHARGES &&
                        contentName == DocumentType.ServicesFromPartners
                    ) {
                        return !item.refValues?.longCharge
                    }

                    if (type == 'analitic' && typeReference == TypeReference.PARTNERS)
                        {
                            return item.refValues?.typePartners == TypePartners.SUPPLIERS 
                        }
                    if (type == 'analitic' && typeReference == TypeReference.CHARGES) {
                        if (user?.role == UserRoles.HEADSECTION) {
                            return !item.refValues?.longCharge && !item.refValues?.shavkatCharge
                        }
                        if (
                            currentDocument.docValues.senderId == 19948 || 
                            currentDocument.docValues.senderId == 19949 
                        )
                            return item.refValues?.shavkatCharge
                        else return !item.refValues?.shavkatCharge

                    }

                    if (
                            contentName == DocumentType.SaleProd 
                            && type == 'receiver'
                            && user?.role != UserRoles.HEADCOMPANY
                            && user?.role != UserRoles.ADMIN
                        ) {
                            return item.refValues?.clientForSectionId == user?.sectionId
                        }

                    return true
                })
                
                .sort(sortByName)
                .filter(( item:ReferenceModel ) => !item.refValues?.markToDeleted )
                .map(( item:ReferenceModel ) => (
                    <option 
                        className={styles.option}
                        key = {item.id}
                        value={item.name}
                        data-type={item.typeReference} 
                        data-id={item.id}
                        // selected={
                        //     item.id == definedItemId || 
                        //     item.id == currentItemId || 
                        //     definedTandirWorkers(item.id, mainData, type) } 
                        >
                            {item.name}
                    </option>  
                ))}
            </select>
        </div>
    );
};
