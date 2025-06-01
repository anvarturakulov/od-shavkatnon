'use client'
import { useState } from 'react';
import { MaydaProps } from './mayda.props';
import styles from './mayda.module.css';
import { Button, SelectReferenceInForm } from '@/app/components';
import { useAppContext } from '@/app/context/app.context';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { getRandomID } from '@/app/service/documents/getRandomID';
import { Maindata } from '@/app/context/app.context.interfaces';
import axios from 'axios';
import { showMessage } from '@/app/service/common/showMessage';
import { TypeReference } from '@/app/interfaces/reference.interface';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { CheckBoxInTable } from '../document/inputs/checkBoxInForm/checkBoxInForm';
import { getDefinedItemIdForSender } from '../document/docValues/doc.values.functions';
import { defaultDocument } from '@/app/context/app.context.constants';
import { InputInForm } from '../document/inputs/inputInForm/inputInForm';
import { validateBody } from '@/app/service/documents/validateBody';
import { updateCreateDocument } from '@/app/service/documents/updateCreateDocument';
import { OrderStatus } from '@/app/interfaces/order.interface';

export const Mayda = ({className, ...props }: MaydaProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const [count, setCount] = useState<number>(0)
    const {currentDocument} = mainData.document
    const { user } = mainData.users;
    // const token = user?.token;
    // const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/references/all/';
    // const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));

    // let num = getRandomID()
    let dateDoc = new Date();
    let dateStr = dateDoc.toISOString().split('T')[0]

    let definedItemIdForReceiver = 0
    let definedItemIdForSender = getDefinedItemIdForSender(user?.role, user?.sectionId, DocumentType.SaleProd)
    let receiverId = definedItemIdForReceiver ? definedItemIdForReceiver : 0
    let senderId = definedItemIdForSender ? definedItemIdForSender : 0
    let analiticId = 0
    let userName = user?.name ? user?.name : '' 

    let newDocument: DocumentModel = {
        date: Date.parse(dateStr),
        documentType: DocumentType.SaleProd,
        docStatus: DocSTATUS.PROVEDEN,
        userId: user?.id ? user.id : 0,
        docValues : {
            senderId: senderId,
            receiverId: receiverId,
            isWorker: false,
            isPartner: false,
            isFounder: false,
            isCash: false,
            analiticId: analiticId,
            count: 0,
            balance: 0,
            price: 0,
            total: 0,
            cashFromPartner: 0,
            comment: '',
            orderTakingDate: 0,
            orderTakingTime: '',
            orderWithDeleviry: false,
            orderAdress: '',
            orderStatus: OrderStatus.OPEN,
            cashFromPartnerSecond: 0,
            cashFromPartnerThird: 0,
            orderTakingDateSecond: 0,
            orderTakingTimeSecond: '',
            orderTakingDateThird: 0,
            orderTakingTimeThird: '',
            countFirst: 0,
            countSecond: 0,
            countThird: 0,
            saleFirst: 0,
            saleSecond: 0,
            saleThird: 0,
        },
        docTableItems: [],
    }   
    
    const cancelSubmit = (setMainData: Function | undefined) => {
        setMainData && setMainData('showMayda', false)
    }

    const setValue = (e: React.FormEvent<HTMLInputElement>) => {
        let target = e.currentTarget;
        let value = +target.value;
        setCount(value)
        
    }

    const onSubmit = (newDocument: DocumentModel, count: number, mainData: Maindata, setMainData: Function | undefined) => {
        // const {currentDocument} = mainData.document
        
        // let body:DocumentModel = {
        //     ...newDocument,
        //     docValues : {
        //         ...newDocument.docValues,
        //         analiticId: currentDocument.docValues.analiticId,
        //         count: currentDocument.docValues.count,
        //         total: currentDocument.docValues.total,
        //     }
        // }

        // if (currentDocument.docValues.isWorker) {
        //     if (!currentDocument.docValues.receiverId) {
        //         showMessage('Ходимни танланг', 'error', setMainData)
        //         return
        //     } else {
        //         body.docValues.receiverId = currentDocument.docValues.receiverId
        //     }
        // } 
            
        // if ( !body.docValues.analiticId ) {
        //     showMessage('Махсулотни танланг', 'error', setMainData)
        //     return
        // }

        // if ( !body.docValues.total ) {
        //     showMessage('Махсулот суммаси йук', 'error', setMainData)
        //     return
        // }
        // const { user } = mainData.users
        // delete body.id;
  
        // const config = {
        //     headers: { Authorization: `Bearer ${user?.token}` }
        // };
 
        // const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/documents/create';
        
        // axios.post(uriPost, body, config)
        // .then(function (request) {
        //     showMessage('Янги хужжат киритилди', 'success', setMainData)
        //     let defValue = {...defaultDocument} 
        //     setMainData && setMainData('currentDocument', {...defValue})
        // })
        // .catch(function (error) {
        //     if (setMainData) {
        //     showMessage(error.message, 'error', setMainData)
        //     }
        // });
        const {currentDocument} = mainData.document;
        const {user} = mainData.users
        // setDisabled(true)
        let body: DocumentModel = {
            ...currentDocument
        }
        if (user?.id) body.userId = user.id
        console.log(body)
        if (!validateBody(body)) {
            showMessage('Хужжатни тулдиришда хатолик бор.', 'error', setMainData);
        } else {
            updateCreateDocument(mainData, setMainData);
        }
        setMainData && setMainData('showMayda', false)
    } 

    if (!mainData.window.showMayda) return <></>
    return (
        <div className={styles.container}>
            <div className={styles.maydaBox}>
                <div className={styles.label}>Сон</div>
                <SelectReferenceInForm 
                    label={'Махсулот'} 
                    typeReference= {TypeReference.TMZ}
                    visibile={true}
                    currentItemId={currentDocument?.docValues.analiticId}
                    type='analitic'
                    maydaSavdo={true}
                />
                <div className={styles.workersBox}>
                    <CheckBoxInTable label = 'Ходим' id={'worker'}/>
                    <SelectReferenceInForm 
                        label={''} 
                        typeReference= {TypeReference.WORKERS}
                        visibile={currentDocument.docValues.isWorker}
                        currentItemId={currentDocument?.docValues.receiverId}
                        type='receiver'
                    />
                </div>
                <InputInForm 
                    nameControl='count' 
                    type='number' 
                    label='Сон' 
                    visible={true} 
                    />
                {/* <input type='number' className={styles.input} onChange={(e) => setValue(e)}/> */}
                <div className={styles.boxBtn} >
                    <Button 
                        className={styles.button} 
                        appearance='primary'
                        onClick={() => onSubmit( newDocument, count, mainData, setMainData )}
                        > Саклаш</Button>
                    <Button className={styles.button} appearance='ghost' onClick={() => cancelSubmit(setMainData)}>Бекор килиш</Button>
                </div>
            </div>
            
            
        </div>   
    )
} 