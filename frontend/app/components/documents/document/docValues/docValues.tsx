import { DocValuesProps } from './docValues.props';
import styles from './docValues.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { DocumentType, OptionsForDocument } from '@/app/interfaces/document.interface';
import { CheckBoxInTable } from '../inputs/checkBoxInForm/checkBoxInForm';
import { getOptionOfDocumentElements } from '@/app/service/documents/getOptionOfDocumentElements';
import { InputInForm } from '../inputs/inputInForm/inputInForm';
import { SelectReferenceInForm } from '../selects/selectReferenceInForm/selectReferenceInForm';
import { addItems, getDefinedItemIdForReceiver, getDefinedItemIdForSender, getLabelForAnalitic, getTypeReferenceForAnalitic, saveItemId } from './doc.values.functions';
import { TypeReference } from '@/app/interfaces/reference.interface';
import { defaultDocumentTableItem } from '@/app/context/app.context.constants';
import { DocTable } from '../docTable/docTable';
import AddIco from './ico/add.svg'
import { getPriceAndBalance } from '@/app/service/documents/getPriceBalance';
import { UserRoles } from '@/app/interfaces/user.interface';
import { useEffect } from 'react';
import { InputForDate } from '../inputs/inputForDate/inputForDate';
import { Info } from '@/app/components';
import { InputForTime } from '../inputs/inputForTime/inputForTime';
import { useRef } from 'react';

export const DocValues = ({ className, ...props }: DocValuesProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { contentName, isNewDocument, contentTitle } = mainData.window;
    const { currentDocument} = mainData.document;
    const { user } = mainData.users;
    const role = user?.role;
    const storageIdFromUser = user?.sectionId;
    const firstInputRef = useRef<HTMLInputElement>(null);

    let options: OptionsForDocument = getOptionOfDocumentElements(contentName)

    let hasWorkers = (contentName == DocumentType.LeaveCash )
    let hasPartners = contentName == DocumentType.LeaveCash;

    let hasCash = (
        (contentName == DocumentType.MoveCash) ||
        (contentName == DocumentType.LeaveCash && (role == UserRoles.GLBUX || role == UserRoles.HEADCOMPANY))
    );
    
    let defaultNewItemForTable = {...defaultDocumentTableItem}
    
    let definedItemIdForReceiver = getDefinedItemIdForReceiver(role, storageIdFromUser, contentName)
    let definedItemIdForSender = getDefinedItemIdForSender(role, storageIdFromUser, contentName)

    const labelForDate = currentDocument.docValues.orderWithDeleviry ? 'Етказиб бериш санаси' : 'Олиб кетиш санаси'
    const labelForTime = currentDocument.docValues.orderWithDeleviry ? 'Етказиб бериш вакти' : 'Олиб кетиш вакти'

    const orderDateAndTime = (
        <div className={styles.dataBoxForOrder}>
            <InputForDate label={labelForDate} id='orderTakingDate'/>
            <InputForTime label={labelForTime}/>    
        </div>
    )

    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);
   
    return (
        <>
            <div className={styles.infoBox}>
                <div className={styles.dataBox}>
                    <InputForDate label={contentTitle} id='date' ref={firstInputRef}/>
                    
                      <Info content={`${currentDocument.id}`} label='№' className={styles.docNumber}/>
                </div>
                
            </div>

            {
                contentName == DocumentType.Order && 
                <div className={styles.deleviryBox}>
                    <CheckBoxInTable label = 'Ектазиб бериш билан бирга' id={'orderWithDeleviry'}/>
                    <InputInForm 
                        nameControl='orderAdress' 
                        type='text' 
                        label='' 
                        visible={currentDocument.docValues.orderWithDeleviry} 
                        isNewDocument
                        disabled ={false}
                        placeholder='Ектазиб бериш манзили'
                        />
                </div>
            }
            { 
                contentName == DocumentType.Order && 
                orderDateAndTime
            }

            <div className={styles.partnersBox}>
                <SelectReferenceInForm 
                    label={options.receiverLabel} 
                    typeReference={options.receiverType}
                    visibile={options.recieverIsVisible}
                    currentItemId={currentDocument?.docValues.receiverId}
                    type='receiver'
                    definedItemId= {definedItemIdForReceiver}
                />

                <SelectReferenceInForm 
                    label={options.senderLabel} 
                    typeReference={options.senderType}
                    visibile={options.senderIsVisible}
                    currentItemId={currentDocument?.docValues.senderId}
                    type='sender'
                    definedItemId= {definedItemIdForSender}
                />
                
            </div>

            <div className={cn(styles.valuesBox)}>
                
                <SelectReferenceInForm 
                    label={getLabelForAnalitic(currentDocument, options)} 
                    typeReference= {getTypeReferenceForAnalitic(currentDocument, options)}
                    visibile={options.analiticIsVisible}
                    currentItemId={currentDocument?.docValues.analiticId}
                    type='analitic'
                />

                <SelectReferenceInForm 
                    label={options.productForChargeLabel} 
                    typeReference={options.productForChargeType}
                    visibile={options.productForChargeIsVisible}
                    currentItemId={currentDocument?.docValues.productForChargeId}
                    type='productForCharge'
                />
                
                <div className={styles.checkBoxs}>
                    { 
                        hasWorkers &&                   
                        <CheckBoxInTable label = 'Ходим' id={'worker'}/> 
                    }

                    { 
                        hasPartners &&                   
                        <CheckBoxInTable label = 'Хамкор' id={'partner'}/> 
                    }

                    { 
                        hasCash &&                   
                        <CheckBoxInTable label = 'Накд пул' id={'cash'}/> 
                    }

                </div>
                
                
                
                {
                    !options.tableIsVisible &&
                    options.balansIsVisible &&
                    <button 
                        className={styles.btnLoad}
                        onClick={() =>  
                            getPriceAndBalance(
                                mainData,
                                setMainData,
                                currentDocument.docValues.senderId,
                                currentDocument.docValues.analiticId,
                                currentDocument.date,
                                false,
                                0
                            )
                        }
                        >Колдик на нархларни юклаш</button>
                }
                
                <InputInForm 
                    nameControl='balance' 
                    type='number' 
                    label='Колдик' 
                    visible={ options.balansIsVisible }
                    disabled ={ true }
                    />
                
                <InputInForm 
                    nameControl='count' 
                    type='number' 
                    label='Сон' 
                    visible={options.countIsVisible} 
                    />
                
                {
                    !options.tableIsVisible &&
                    <>
                        <InputInForm 
                            nameControl='price' 
                            type='number' 
                            label='Нарх' 
                            visible={options.priceIsVisible} 
                            isNewDocument
                            disabled ={options.priceIsDisabled}
                            />
                        <InputInForm 
                            nameControl='total' 
                            type='number' 
                            label={contentName == DocumentType.SaleProd? 'Махсулот суммаси':'Сумма'} 
                            visible={options.totalIsVisible}
                            disabled={options.totalIsDisabled}
                            />
                        
                        <InputInForm 
                            nameControl='cashFromPartner' 
                            type='number' 
                            label={options.cashFromPartnerLabel} 
                            visible={options.cashFromPartnerVisible}
                            disabled={false}
                            />

                        <InputInForm nameControl='comment' type='text' label='Изох' visible={options.commentIsVisible}/>

                    </>
                }

                {options.tableIsVisible && 
                    <div className={cn(styles.add, {[styles.notView] : false == false})}>
                        <AddIco onClick={() => addItems(setMainData, mainData ,defaultNewItemForTable)}/>
                    </div>
                }
                
                {options.tableIsVisible && 
                    <DocTable 
                        typeReference={TypeReference.TMZ}
                        items={currentDocument.docTableItems} 
                />}

            </div>
        </>
    )
}


