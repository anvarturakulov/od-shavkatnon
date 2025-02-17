'use client'
import { useState } from 'react';
import { MaydaProps } from './mayda.props';
import styles from './mayda.module.css';
import { Button, SelectReferenceInForm } from '@/app/components';
import { useAppContext } from '@/app/context/app.context';
import { DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { getRandomID } from '@/app/service/documents/getRandomID';
import { getDefinedItemIdForSender } from '../docValues/doc.values.functions';
import { Maindata } from '@/app/context/app.context.interfaces';
import axios from 'axios';
import { showMessage } from '@/app/service/common/showMessage';
import { TypeReference } from '@/app/interfaces/reference.interface';
import { defaultDocumentFormItems } from '@/app/context/app.context.constants';
import useSWR from 'swr';
import { getDataForSwr } from '@/app/service/common/getDataForSwr';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { CheckBoxInTable } from '../document/inputs/checkBoxInForm/checkBoxInForm';

export const Mayda = ({className, ...props }: MaydaProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const [count, setCount] = useState<number>(0)
    const {currentDocument} = mainData

    const { user } = mainData;
    const token = user?.access_token;
    const url = process.env.NEXT_PUBLIC_DOMAIN+'/api/reference/getAll/';
    const { data, mutate } = useSWR(url, (url) => getDataForSwr(url, token));

    let num = getRandomID()
    let dateDoc = new Date();
    let dateStr = dateDoc.toISOString().split('T')[0]

    let definedItemIdForReceiver = '659d292d630ca82ec3dcae1c'
    let definedItemIdForSender = getDefinedItemIdForSender(mainData.user?.role, mainData.user?.storageId, DocumentType.SaleProd)
    let receiverId = definedItemIdForReceiver ? definedItemIdForReceiver : ''
    let senderId = definedItemIdForSender ? definedItemIdForSender : ''
    let analiticId = '659d2778630ca82ec3dcadf8'
    let userName = mainData.user?.name ? mainData.user?.name : '' 

    let newDocument: DocumentModel = {
        date: Date.parse(dateStr),
        docNumber: num,
        documentType: DocumentType.SaleProd,
        deleted: false,
        user: userName,
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
        proveden: true,
        firstWorkerId: '',
        secondWorkerId: '',
        thirdWorkerId: '',
        tableItems: [],
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
        let price = getPropertySubconto(data, mainData.currentDocument.analiticId).thirdPrice
        let total = price ? price * count : 0

        let body:DocumentModel = {
            ...newDocument,
            analiticId: mainData.currentDocument.analiticId,
            count,
            total,
        }

        if (currentDocument.isWorker) {
            if (!currentDocument.receiverId) {
                showMessage('Ходимни танланг', 'error', setMainData)
                return
            } else {
                body.receiverId = currentDocument.receiverId
            }
        } 
            
        if ( !body.analiticId ) {
            showMessage('Махсулотни танланг', 'error', setMainData)
            return
        }

        if ( !body.total ) {
            showMessage('Махсулот суммаси йук', 'error', setMainData)
            return
        }
        // console.log(body)
        const { user } = mainData
        delete body._id;
  
        const config = {
            headers: { Authorization: `Bearer ${user?.access_token}` }
        };
 
        const uriPost = process.env.NEXT_PUBLIC_DOMAIN + '/api/document/create';
        
        axios.post(uriPost, body, config)
        .then(function (request) {
            showMessage('Янги хужжат киритилди', 'success', setMainData)
            let defValue = {...defaultDocumentFormItems} 
            setMainData && setMainData('currentDocument', {...defValue})
        })
        .catch(function (error) {
            if (setMainData) {
            showMessage(error.message, 'error', setMainData)
            }
        });
        setMainData && setMainData('showMayda', false)
    } 

    if (!mainData.showMayda) return <></>
    return (
        <div className={styles.container}>
            <div className={styles.maydaBox}>
                <div className={styles.label}>Сон</div>
                <SelectReferenceInForm 
                    label={'Махсулот'} 
                    typeReference= {TypeReference.TMZ}
                    visibile={true}
                    currentItemId={currentDocument?.analiticId}
                    type='analitic'
                />
                <div className={styles.workersBox}>
                    <CheckBoxInTable label = 'Ходим' id={'worker'}/>
                    <SelectReferenceInForm 
                        label={''} 
                        typeReference= {TypeReference.WORKERS}
                        visibile={currentDocument.isWorker}
                        currentItemId={currentDocument?.receiverId}
                        type='receiver'
                    />
                </div>
                <input type='number' className={styles.input} onChange={(e) => setValue(e)}/>
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