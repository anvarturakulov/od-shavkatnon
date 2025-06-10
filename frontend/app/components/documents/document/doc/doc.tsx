'use client'
import { useEffect, useState } from 'react';
import { DocProps } from './doc.props';
import styles from './doc.module.css';
import { Button, DocValues, Info } from '@/app/components';
import { useAppContext } from '@/app/context/app.context';
import { InputForDate } from '../inputs/inputForDate/inputForDate';
import { cancelSubmit, saveUser } from './helpers/doc.functions';
import { isUsersForProveden } from '@/app/service/common/users';
import { DocSTATUS, DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { validateBody } from '@/app/service/documents/validateBody';
import { showMessage } from '@/app/service/common/showMessage';
import { updateCreateDocument } from '@/app/service/documents/updateCreateDocument';
import { InputInForm } from '../inputs/inputInForm/inputInForm';
import cn from 'classnames';
import { InputForTime } from '../inputs/inputForTime/inputForTime';

export const Doc = ({className, ...props }: DocProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { contentTitle, isNewDocument, contentName } = mainData.window;
    const { user } = mainData.users
    const { currentDocument } = mainData.document;
    const [disabled, setDisabled] = useState<boolean>(false)

    useEffect(() => {
        if (!currentDocument.userId) {
            saveUser(setMainData, mainData)
        }
    },[])

    

    useEffect(() => {
        if (isNewDocument) {
            const newDocument: DocumentModel= {
                ...currentDocument,
                date: currentDocument.date,
                userId: mainData.users.user?.id ? mainData.users.user?.id : 0,
                documentType: mainData.window.contentName,
                docValues: {
                    ...currentDocument.docValues,
                    analiticId: 0,
                    productForChargeId: 0,
                    comment : '',
                }
            };
            if (setMainData) {
                setMainData('currentDocument', newDocument);
            }

        }
    }, [isNewDocument]);

    
    const onSubmit = ( mainData: Maindata, setMainData: Function| undefined ) => {
        const {currentDocument} = mainData.document;
        const {user} = mainData.users
        setDisabled(true)
        let body: DocumentModel = {
            ...currentDocument
        }
        if (user?.id) body.userId = user.id
        
        if (!validateBody(body)) {
            showMessage('Хужжатни тулдиришда хатолик бор.', 'error', setMainData);
            setDisabled(false)
        } else {
            updateCreateDocument(mainData, setMainData);
            setDisabled(true)
        }
    }
    const BtnBox = (
        <div className={styles.boxBtn}>
            {
                ( isNewDocument || 
                    (
                        currentDocument.docStatus != DocSTATUS.PROVEDEN && 
                        isUsersForProveden(user)
                    )
                ) &&
                <>
                    <button 
                        className={styles.button}
                        disabled = {disabled} 
                        onClick={() => onSubmit( mainData, setMainData)}
                        >
                            Саклаш
                    </button>
                    
                    <Button className={styles.button} appearance='ghost' onClick={() => cancelSubmit(setMainData, mainData)}>Бекор килиш</Button>
                </>
            }
        </div>
    )

    

    // console.log(contentName)
    return (
        <div className={styles.docBox}>
            {/* <div className={styles.infoBox}>
                <div className={styles.dataBox}>
                    <InputForData label={contentTitle} id='date'/>
                    
                      <Info content={`${currentDocument.id}`} label='№' className={styles.docNumber}/>
                </div>
                { 
                    contentName == DocumentType.Order && 
                    orderDateAndTime
                }
            </div> */}

            <DocValues/>
            {/* {currentDocument.docValues.firstWorkerId} */}
            {BtnBox}          
        </div>   
    )
} 