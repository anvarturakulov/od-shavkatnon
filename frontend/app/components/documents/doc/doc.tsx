'use client'
import { useEffect, useState } from 'react';
import { DocProps } from './doc.props';
import styles from './doc.module.css';
import { Button, DocValues, Info } from '@/app/components';
import { useAppContext } from '@/app/context/app.context';
import { InputForData } from '../inputs/inputForData/inputForData';
import { cancelSubmit, saveUser } from './helpers/doc.functions';
import { isAdmins, isGlBuxs } from '@/app/service/common/users';
import { DocumentModel, DocumentType } from '@/app/interfaces/document.interface';
import { Maindata } from '@/app/context/app.context.interfaces';
import { validateBody } from '@/app/service/documents/validateBody';
import { showMessage } from '@/app/service/common/showMessage';
import { updateCreateDocument } from '@/app/service/documents/updateCreateDocument';

export const Doc = ({className, ...props }: DocProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { contentTitle, currentDocument, isNewDocument, contentName } = mainData;
    const [disabled, setDisabled] = useState<boolean>(false)

    useEffect(() => {
        if (!currentDocument.user) {
            saveUser(setMainData, mainData)
        }
        // if (contentName == DocumentType.MoveMaterial || contentName == DocumentType.LeaveMaterial) {
        //     getEntrysJournal(setMainData, mainData, currentDocument.date);
        // }
    },[])

    const onSubmit = ( mainData: Maindata, setMainData: Function| undefined ) => {
        const {currentDocument} = mainData;
        setDisabled(true)
        let body: DocumentModel = {
            ...currentDocument,
        }
        
        if (!validateBody(body)) {
            showMessage('Хужжатни тулдиришда хатолик бор.', 'error', setMainData);
            setDisabled(false)
        } else {
            updateCreateDocument(mainData, setMainData);
            setDisabled(true)
        }
    }

    return (
        <div className={styles.docBox}>
            <div className={styles.infoBox}>
                <div className={styles.dataBox}>
                    <InputForData label={contentTitle}/>
                    <Info content={currentDocument.docNumber.toString()} label='№' className={styles.docNumber}/>
                </div>
            </div>

            <DocValues/>
            {currentDocument.firstWorkerId}
            <div className={styles.boxBtn}>
                {
                    ( 
                        isNewDocument || 
                        (currentDocument.deleted && (isAdmins(mainData.user) || isGlBuxs(mainData.user)))  
                    ) 
                    &&
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
        </div>   
    )
} 