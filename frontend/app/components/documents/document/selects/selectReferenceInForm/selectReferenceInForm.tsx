import { SelectReferenceInFormProps, TypeForSelectInForm } from './selectReferenceInForm.props';
import styles from './selectReferenceInForm.module.css';
import { useAppContext } from '@/app/context/app.context';
import useSWR from 'swr';
import cn from 'classnames';
import { ReferenceModel, TypePartners, TypeReference } from '@/app/interfaces/reference.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { sortByName } from '@/app/service/references/sortByName';
import { getTypeDocumentForReference } from '@/app/service/documents/getTypeDocumentForReference';
import { UserRoles } from '@/app/interfaces/general.interface';
import { DocumentType } from '@/app/interfaces/document.interface';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { definedTandirWorkers } from './helper';
import { docsDependentToBalance, docsDependentToMiddlePrice } from '../../doc/helpers/documentTypes';


export const SelectReferenceInForm = ({ label, typeReference, visibile=true , definedItemId ,currentItemId, type, className, ...props }: SelectReferenceInFormProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const { user, contentName, currentDocument } = mainData;
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/byType/'+typeReference;
    const { data } = useSWR(url, (url) => getDataForSwr(url, token));

    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata, type: TypeForSelectInForm) => {
        
        let {currentDocument, contentName, user } = mainData;
        let role = user?.role;
        
        if (currentDocument) {
            let target = e.currentTarget;
            let currentItem = {...currentDocument};
            let id = target[target.selectedIndex].getAttribute('data-id');

            if (type == 'sender' && id) {
                currentItem.senderId = id
                if (docsDependentToBalance.includes(contentName)) currentItem.balance = 0;
                if (docsDependentToMiddlePrice.includes(contentName)) currentItem.price = 0;
            }
            if (type == 'receiver' && id) currentItem.receiverId = id;
              
            if (type == 'analitic' && id) {
                currentItem.analiticId = id
                
                if (docsDependentToBalance.includes(contentName)) currentItem.balance = 0;
                if (docsDependentToMiddlePrice.includes(contentName)) currentItem.price = 0;

                if (user?.role == UserRoles.DELIVERY) {
                    let price = getPropertySubconto(data, id).firstPrice
                    
                    if (price) {
                        currentItem.price = price
                        currentItem.total = price * currentItem.count
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
    let flagDisabled = Boolean(definedItemId?.length)

    if ( mainData.user?.role == UserRoles.GLBUX && 
        currentDocument.documentType == DocumentType.ComeProduct
    ) {
        flagDisabled = false
    }
 
    if (type == 'sender' && contentName == DocumentType.ServicesFromPartners) currentItemId = ''

    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <select
                className={cn(styles.select)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData, type)}
                disabled = { flagDisabled }
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
                .filter((item:ReferenceModel) => {
                    if (typeReference == TypeReference.TMZ) {
                        switch (typeDocumentForReference) {
                            case 'MATERIAL':
                                return item.typeTMZ == 'MATERIAL'
                            case 'PRODUCT':
                                return item.typeTMZ == 'PRODUCT'
                            case 'HALFSTUFF':
                                return item.typeTMZ == 'HALFSTUFF'
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
                            return ( item.filial  || item.delivery || item.sklad ) 
                        }
                    
                    if ((type == 'receiver' || type == 'sender') && 
                         ( contentName == DocumentType.MoveHalfstuff || 
                           contentName == DocumentType.MoveMaterial ||
                           contentName == DocumentType.ComeHalfstuff ||
                           contentName == DocumentType.ComeProduct ))
                        {
                            return (item.filial  || item.sklad) 
                        }
                    
                    if ((type == 'receiver') && 
                        contentName == DocumentType.LeaveCash) {
                        if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                            return (item.filial || item.maxsud || item.shavkat || item.umumBulim || item.director) 
                        } else if (user?.role == UserRoles.GLBUX || user?.role == UserRoles.ZAMGLBUX) {
                            return (item.filial || item.umumBulim )
                        } else {
                            return (item.filial || item.sklad || item.delivery || item.buxgalter || item.umumBulim)
                        }
                    }

                    if (type == 'receiver' && contentName == DocumentType.TakeProfit) {
                        return (item.maxsud || item.shavkat)
                    }

                    if ((type == 'sender') && 
                        contentName == DocumentType.LeaveCash) {
                        if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                          return (item.filial || item.buxgalter || item.maxsud || item.shavkat || item.director) 
                        } 
                    }

                    if ((type == 'sender' || type == 'receiver') && 
                        contentName == DocumentType.MoveCash) {
                        if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                            return (item.filial || item.sklad || item.delivery || item.buxgalter  || item.maxsud || item.shavkat) 
                        } else if (user?.role == UserRoles.GLBUX) {
                            return (item.filial || item.sklad || item.delivery || item.buxgalter || item.director)
                        } else {
                            return (item.filial || item.sklad || item.delivery || item.buxgalter || item.director)
                        }
                    }

                    if (type == 'receiver' && contentName == DocumentType.ZpCalculate)
                        {
                            return ( item.filial || item.umumBulim) 
                        }
                    
                    if (type == 'receiver' && contentName == DocumentType.ServicesFromPartners)
                        {
                            return item.filial 
                        }

                    if (type == 'receiver' && contentName == DocumentType.ComeCashFromPartners)
                        {
                            if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                              return (item.buxgalter || item.maxsud || item.shavkat) 
                            } 
                            return ( item.buxgalter ) 
                        }

                    if (type == 'receiver' && contentName == DocumentType.ComeMaterial)
                        {
                            return ( item.filial  || item.sklad) 
                        }
                    
                    if (type == 'sender' && 
                        ( contentName == DocumentType.LeaveMaterial || 
                          contentName == DocumentType.LeaveHalfstuff || 
                          contentName == DocumentType.LeaveProd ||
                          contentName == DocumentType.SaleMaterial
                        ))
                        {
                            return (item.filial || item.sklad) 
                        }
                    
                    if ( type == 'sender' && contentName == DocumentType.SaleProd) 
                        {
                            return (item.filial || item.delivery) 
                        }

                    if (type == 'sender' && ( contentName == DocumentType.ComeMaterial || contentName == DocumentType.ComeCashFromPartners || 
                        contentName == DocumentType.ComeProductImport )) {
                        return ( item.typePartners == TypePartners.SUPPLIERS ) 
                    }

                    if (type == 'receiver' && contentName == DocumentType.SaleHalfStuff ) {
                        return ( item.typePartners == TypePartners.SUPPLIERS ) 
                    }

                    if (type == 'sender' && typeReference == TypeReference.CHARGES &&
                        contentName == DocumentType.ServicesFromPartners
                    ) {
                        return !item.longCharge
                    }

                    if (type == 'analitic' && typeReference == TypeReference.PARTNERS)
                        {
                            return item.typePartners == TypePartners.SUPPLIERS 
                        }
                    if (type == 'analitic' && typeReference == TypeReference.CHARGES) {
                        if (user?.role == UserRoles.HEADSECTION) {
                            return !item.longCharge && !item.shavkat
                        }
                        if (
                            currentDocument.senderId == '6645f381d8cc46842f33e9e9' || 
                            currentDocument.senderId == '6645f4e1d8cc46842f33ea2b' ||
                            currentDocument.senderId == '664455bbadb82fe6d06df149'

                        )
                            return item.shavkat
                        else return !item.shavkat

                    }

                    if (
                            contentName == DocumentType.SaleProd 
                            && type == 'receiver'
                            && user?.role != UserRoles.HEADCOMPANY
                            && user?.role != UserRoles.ADMIN
                        ) {
                            return item.clientForDeliveryId == user?.storageId
                        }

                    return true
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
                            selected={
                                item._id == definedItemId || 
                                item._id == currentItemId || 
                                definedTandirWorkers(item._id, mainData, type) } 
                            >
                                {item.name}
                        </option>  
                    </>
                ))}
            </select>
        </div>
    );
};
