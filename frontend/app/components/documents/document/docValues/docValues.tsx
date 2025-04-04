import { DocValuesProps } from './docValues.props';
import styles from './docValues.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { DocumentType, OptionsForDocument } from '@/app/interfaces/document.interface';
import { CheckBoxInTable } from '../inputs/checkBoxInForm/checkBoxInForm';
import { getOptionOfDocumentElements } from '@/app/service/documents/getOptionOfDocumentElements';
import { InputInForm } from '../inputs/inputInForm/inputInForm';
import { SelectReferenceInForm } from '../selects/selectReferenceInForm/selectReferenceInForm';
import { addItems, getDefinedItemIdForReceiver, getDefinedItemIdForSender, getLabelForAnalitic, getTypeReferenceForAnalitic, saveItemId, visibilityCommentValueInDocument } from './doc.values.functions';
import { TypeReference } from '@/app/interfaces/reference.interface';
import { defaultDocumentTableItem } from '@/app/context/app.context.constants';
import { DocTable } from '../docTable/docTable';
import AddIco from './ico/add.svg'
import { getPriceAndBalance } from '@/app/service/documents/getPriceBalance';
import { UserRoles } from '@/app/interfaces/user.interface';

export const DocValues = ({ className, ...props }: DocValuesProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { contentName, isNewDocument } = mainData.window;
    const { currentDocument} = mainData.document;
    const { user } = mainData.users;
    const role = user?.role;
    const storageIdFromUser = user?.sectionId;
    
    let options: OptionsForDocument = getOptionOfDocumentElements(contentName)

    let hasWorkers = (contentName == DocumentType.LeaveCash )
    let hasPartners = contentName == DocumentType.LeaveCash;
    let hasFounder = contentName == DocumentType.LeaveCash;
    let hasCash = (
        (contentName == DocumentType.MoveCash) ||
        (contentName == DocumentType.LeaveCash && (role == UserRoles.GLBUX || role == UserRoles.HEADCOMPANY))
    );
    
    let defaultNewItemForTable = {...defaultDocumentTableItem}
    
    let definedItemIdForReceiver = getDefinedItemIdForReceiver(role, storageIdFromUser, contentName)
    let definedItemIdForSender = getDefinedItemIdForSender(role, storageIdFromUser, contentName)
    
    return (
        <>
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
                
                <SelectReferenceInForm 
                    label={getLabelForAnalitic(currentDocument, options)} 
                    typeReference= {getTypeReferenceForAnalitic(currentDocument, options)}
                    visibile={options.analiticIsVisible}
                    currentItemId={currentDocument?.docValues.analiticId}
                    type='analitic'
                />

                
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
                        <InputInForm nameControl='comment' type='text' label='Изох' visible={visibilityCommentValueInDocument(contentName, mainData.users.user)}/>

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


