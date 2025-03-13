'use client'
import { useEffect, useState } from 'react';
import { ReferenceProps } from './reference.props';
import styles from './reference.module.css';
import cn from 'classnames';
import { Button, Input} from '@/app/components';
import { ReferenceModel, TypePartners, TypeReference, TypeSECTION, TypeTMZ } from '../../interfaces/reference.interface';
import { typePartnersList, typeSectionList, typeTMZList } from './helpers/reference.constants';
import { useAppContext } from '@/app/context/app.context';
import { Select } from './helpers/reference.components';
import { cancelSubmit, defineTypePartners, defineTypeSection, defineTypeTMZ, onSubmit } from './helpers/reference.functions';
import { getTypeReference } from '@/app/service/references/getTypeReference';
import { getTypeReferenceByTitle } from '@/app/service/references/getTypeReferenceByTitle';
import { CheckBoxForReference } from './checkBoxForReference/checkBoxForReference';
import { SelectForReferences } from './selectForReferences/selectForReferences';
import { UserRoles } from '@/app/interfaces/user.interface';

export const Reference = ({ className, ...props }: ReferenceProps) :JSX.Element => {

    const {mainData, setMainData} = useAppContext();
    const {isNewReference, showReferenceWindow} = mainData.window
    const { user } = mainData.users
    const { currentReference } = mainData.reference
    const { contentName } = mainData.window;
    const typeReference = getTypeReference( contentName );

    const defaultBody: ReferenceModel = {
        name: '',
        oldId: '',
        typeReference, 
        refValues : {
        }
    }

    const [body, setBody] = useState<ReferenceModel>(defaultBody) 

    const changeElements = (e: React.FormEvent<HTMLInputElement>) => {
        let target = e.currentTarget
        let value = target.value
        let id = target.id
        if (id == 'typeTMZ') value = defineTypeTMZ(value)
        if (id == 'typePartners') value = defineTypePartners(value)
        if (id == 'typeSection') value = defineTypeSection(value)
        setBody((state:ReferenceModel) => {
            if (id == 'name') {
                return {
                    ...state,
                    [id]: value
                }
            } else {
                return {
                    ...state,
                    refValues: {
                        ...state.refValues,
                        [id]: value
                    }
                }
            }
        })
    }

    const setCheckbox = (checked: boolean, id: string) => {
        setBody((state:ReferenceModel) => {
            
            return {
                ...state,
                refValues: {
                    ...state.refValues,
                    [id]: checked
                }
            }
        })
    }

    const setClientForSectionId = (id: number) => {
        setBody((state:ReferenceModel) => {
            return {
                ...state,
                refValues : {
                    ...state.refValues,
                    clientForSectionId : id
                }
            }
        })
    }

    useEffect(()=> {
        setBody(defaultBody);
    }, [mainData.window.clearControlElements])

    useEffect(() => {
        const {currentReference} = mainData.reference
        if (currentReference != undefined || currentReference != null) {
            const { typePartners, typeTMZ, unit, comment, typeSection } = currentReference.refValues
            let newBody: ReferenceModel = {
                ...currentReference,
                typeReference: getTypeReferenceByTitle(currentReference.typeReference),
                refValues : {
                    ...currentReference.refValues
                }
            }
            setBody(newBody)
        }
    }, [ currentReference ])

    return (
        <div className={cn(styles.referenceBox, 
            {[styles.newReference] : isNewReference},
            {[styles.boxClose] : !showReferenceWindow})}>

            <Input label={'Номи'} value={body.name} type="text" id='name' className={styles.input} onChange={(e)=>changeElements(e)}/>
            {
                typeReference == TypeReference.PARTNERS && 
                Select(typePartnersList, body, 'Хамкор тури', 'typePartners', changeElements)
            }

            {
                typeReference == TypeReference.TMZ && 
                <div className={styles.box}> 
                    {
                        Select(typeTMZList, body, 'ТМБ тури', 'typeTMZ', changeElements)
                    }
                    <Input label={'Улчов бирлиги'} value={body.refValues?.unit} type="text" id='unit' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            }

            {
                user?.role == UserRoles.ADMIN && 
                body.typeReference == TypeReference.STORAGES && 
                <div className={styles.box}> 
                    {
                        Select(typeSectionList, body, 'Булим тури', 'typeSection', changeElements)
                    }
                </div>
            }

            <div className={styles.checkBoxs}>
                {
                    ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY )  && 
                    body.typeReference == TypeReference.TMZ &&
                    <CheckBoxForReference label='Ун' setCheckbox={setCheckbox} checked={body.refValues?.un} id={'un'}/>
                }

                {
                    user?.role == UserRoles.ADMIN && 
                    body.typeReference == TypeReference.CHARGES &&
                    <CheckBoxForReference label='Ойлик харажат' setCheckbox={setCheckbox} checked={body.refValues.longCharge} id={'longCharge'}/>
                }

                {
                    user?.role == UserRoles.ADMIN && 
                    body.typeReference == TypeReference.CHARGES &&
                    <CheckBoxForReference label='Шавкат харажати' setCheckbox={setCheckbox} checked={body.refValues.shavkatCharge} id={'shavkatCharge'}/>
                }
                
            </div>

            {
                ( 
                    user?.role == UserRoles.ADMIN || 
                    user?.role == UserRoles.HEADCOMPANY 
                ) &&
                body.typeReference == TypeReference.TMZ &&
                body.refValues?.typeTMZ == TypeTMZ.PRODUCT &&

                <div className={styles.priceBox}>
                    <Input label={'Биринчи нарх'} value={body.refValues?.firstPrice} type="number" id='firstPrice' className={styles.input} onChange={(e)=>changeElements(e)}/>
                    <Input label={'Иккинчи нарх'} value={body.refValues?.secondPrice} type="number" id='secondPrice' className={styles.input} onChange={(e)=>changeElements(e)}/>
                    <Input label={'Учинчи нарх'} value={body.refValues?.thirdPrice} type="number" id='thirdPrice' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            }
            
            {
                ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY )  && 
                (body.refValues?.typePartners == TypePartners.CLIENTS) &&
                <SelectForReferences label='Клиент сохиби' typeReference={TypeReference.STORAGES} currentItemId={body.refValues?.clientForSectionId} setClientForSectionId={setClientForSectionId}/>
            }

            {
                ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY )  && 
                (body.typeReference == TypeReference.TMZ) && (body.refValues?.typeTMZ == TypeTMZ.MATERIAL) &&
                <Input label={'Норма'} value={body.refValues?.norma} type="number" id='norma' className={styles.input} onChange={(e)=>changeElements(e)}/>
            }

            {
                body.typeReference == TypeReference.WORKERS &&
                <Input label={'Телеграм ID'} value={body.refValues?.telegramId} type="text" id='telegramId' className={styles.input} onChange={(e)=>changeElements(e)}/>
            }

            <Input label={'Изох'} value={body.refValues?.comment} type="text" id='comment' className={styles.input} onChange={(e)=>changeElements(e)}/>
            
        <div className={styles.boxBtn}>
            <Button appearance='primary' onClick={() => 
                onSubmit(body,
                            typeReference, 
                            isNewReference,
                            setMainData,
                            user?.token)}
                >Саклаш</Button>
            <Button appearance='ghost' onClick={() => cancelSubmit(setMainData)}>Бекор килиш</Button>
        </div> 
    </div>   
    )
} 