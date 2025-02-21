'use client'
import { useEffect, useState } from 'react';
import { ReferenceProps } from './reference.props';
import styles from './reference.module.css';
import cn from 'classnames';
import { Button} from '@/app/components';
import { ReferenceModel, TypePartners, TypeReference, TypeSECTION, TypeTMZ } from '../../interfaces/reference.interface';
import { typePartnersList, typeTMZList } from './helpers/reference.constants';
import { useAppContext } from '@/app/context/app.context';
import { Select } from './helpers/reference.components';
import { cancelSubmit, defineTypePartners, defineTypeTMZ, onSubmit } from './helpers/reference.functions';
import { getTypeReference } from '@/app/service/references/getTypeReference';
import { getTypeReferenceByTitle } from '@/app/service/references/getTypeReferenceByTitle';
import { CheckBoxForReference } from './checkBoxForDelivery/checkBoxForReference';
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
            typePartners: undefined,
            typeTMZ: undefined,
            unit: '',
            comment: '',
            un: false,
            clientForSectionId: -1,
            firstPrice:0,
            secondPrice:0,
            thirdPrice:0,
            markToDeleted: false,
            norma: 0,
            longCharge: false,
            shavkatCharge: false
        }
    }

    const [body, setBody] = useState<ReferenceModel>(defaultBody) 

    const changeElements = (e: React.FormEvent<HTMLInputElement>) => {
        let target = e.currentTarget
        let value = target.value
        let id = target.id
        if (id == 'typeTMZ') value = defineTypeTMZ(value)
        if (id == 'typePartners') value = defineTypePartners(value)
        
        setBody((state:ReferenceModel) => {
            if (id in ['name', 'typeReference']) {
                return {
                    ...state,
                    [id]: value
                }
            } else {
                return {
                    ...state,
                    refValues: {
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
                    [`${id}`]: checked
                }
            }
        })
    }

    const setClientForSectionId = (id: number) => {
        setBody((state:ReferenceModel) => {
            return {
                ...state,
                refValues : {
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
        if (currentReference != undefined) {
            const { typePartners, typeTMZ, unit, comment } = currentReference.refValues
            let newBody: ReferenceModel = {
                ...currentReference,
                typeReference: getTypeReferenceByTitle(currentReference.typeReference),
                refValues : {
                    typePartners: typePartners,
                    typeTMZ: typeTMZ,
                    unit: unit,
                    comment: comment,
                }
            }
            setBody(newBody)
        }
    }, [ currentReference ])

    return (
        <div className={cn(styles.referenceBox, 
            {[styles.newReference] : isNewReference},
            {[styles.boxClose] : !showReferenceWindow})}>
            <div className={styles.nameBox}>
                <div>Номи</div>
                <input value={body.name} type="text" id='name' className={styles.input} onChange={(e)=>changeElements(e)}/>
            </div>
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
                    <div>
                        <div>Улчов бирлиги</div>
                        <input value={body.refValues.unit} type="text" id='unit' className={styles.input} onChange={(e)=>changeElements(e)}/>
                    </div>
                </div>
            }

            <div className={styles.checkBoxs}>
                {
                    user?.role == UserRoles.ADMIN && 
                    body.typeReference == TypeReference.STORAGES &&
                    <CheckBoxForReference label='Юк ташувчи' setCheckbox={setCheckbox} checked={body.refValues.typeSection == TypeSECTION.DELIVERY} id={'delivery'}/>
                }

                {
                    user?.role == UserRoles.ADMIN && 
                    body.typeReference == TypeReference.STORAGES &&
                    <CheckBoxForReference label='Умумий булим' setCheckbox={setCheckbox} checked={body.refValues.typeSection == TypeSECTION.COMMON} id={'umumBulim'}/>
                }

                {
                    user?.role == UserRoles.ADMIN && 
                    body.typeReference == TypeReference.STORAGES &&
                    <CheckBoxForReference label='Филиал' setCheckbox={setCheckbox} checked={body.refValues.typeSection == TypeSECTION.FILIAL} id={'filial'}/>
                }

                {
                    user?.role == UserRoles.ADMIN && 
                    body.typeReference == TypeReference.STORAGES &&
                    <CheckBoxForReference label='Склад' setCheckbox={setCheckbox} checked={body.refValues.typeSection == TypeSECTION.STORAGE} id={'sklad'}/>
                }

                {
                    ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY )  && 
                    body.typeReference == TypeReference.TMZ &&
                    <CheckBoxForReference label='Ун' setCheckbox={setCheckbox} checked={body.refValues.un} id={'un'}/>
                }

                {
                    ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY )  && 
                    body.typeReference == TypeReference.STORAGES &&
                    <CheckBoxForReference label='Бухгалтер' setCheckbox={setCheckbox} checked={body.refValues.typeSection == TypeSECTION.ACCOUNTANT} id={'buxgalter'}/>
                }

                {
                    user?.role == UserRoles.ADMIN && 
                    body.typeReference == TypeReference.CHARGES &&
                    <CheckBoxForReference label='Ойлик харажат' setCheckbox={setCheckbox} checked={body.refValues.longCharge} id={'longCharge'}/>
                }
                
            </div>

            {
                ( 
                    user?.role == UserRoles.ADMIN || 
                    user?.role == UserRoles.HEADCOMPANY 
                ) &&
                body.typeReference == TypeReference.TMZ &&
                body.refValues.typeTMZ == TypeTMZ.PRODUCT &&

                <div className={styles.priceBox}>
                    <div>
                        <div>Биринчи нарх</div>
                        <input value={body.refValues.firstPrice} type="number" id='firstPrice' className={styles.input} onChange={(e)=>changeElements(e)}/>
                    </div>
                    <div>
                        <div>Иккинчи нарх</div>
                        <input value={body.refValues.secondPrice} type="number" id='secondPrice' className={styles.input} onChange={(e)=>changeElements(e)}/>
                    </div>
                    <div>
                        <div>Учинчи нарх</div>
                        <input value={body.refValues.thirdPrice} type="number" id='thirdPrice' className={styles.input} onChange={(e)=>changeElements(e)}/>
                    </div>
                </div>
            }
            
            {
                ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY )  && 
                (body.refValues.typePartners == TypePartners.CLIENTS) &&
                <SelectForReferences label='Клиент сохиби' typeReference={TypeReference.STORAGES} currentItemId={body.refValues.clientForSectionId} setClientForSectionId={setClientForSectionId}/>
            }

            {
                ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY )  && 
                (body.typeReference == TypeReference.TMZ) && (body.refValues.typeTMZ == TypeTMZ.MATERIAL) &&
                <>
                <div>Норма</div>
                <input value={body.refValues.norma} type="number" id='norma' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </>
            }

            {
                ( user?.role == UserRoles.ADMIN )  && 
                (body.typeReference == TypeReference.STORAGES) &&
                <>
                    <div>
                        <CheckBoxForReference label='Директор' setCheckbox={setCheckbox} checked={body.refValues.typeSection == TypeSECTION.DIRECTOR} id={'director'}/>
                    </div>
                </>
            }

            {
                ( user?.role == UserRoles.ADMIN )  && 
                (body.typeReference == TypeReference.CHARGES || body.typeReference == TypeReference.STORAGES) &&
                <>
                    <div>
                        <CheckBoxForReference label='Шавкат' setCheckbox={setCheckbox} checked={body.refValues.shavkatCharge} id={'shavkatCharge'}/>
                    </div>
                </>
            }

            {
                body.typeReference == TypeReference.WORKERS &&
                <div>
                    <div>Телеграм ID</div>
                    <input value={body.refValues.telegramId} type="text" id='telegramId' className={styles.input} onChange={(e)=>changeElements(e)}/>
                </div>
            }

            <div>
                <div>Изох</div>
                <input value={body.refValues.comment} type="text" id='comment' className={styles.input} onChange={(e)=>changeElements(e)}/>
            </div>
            
        <div className={styles.boxBtn}>
            <Button appearance='primary' onClick={() => 
                onSubmit(body,
                            typeReference, 
                            isNewReference,
                            setMainData,
                            user?.access_token)}
                >Саклаш</Button>
            <Button appearance='ghost' onClick={() => cancelSubmit(setMainData)}>Бекор килиш</Button>
        </div> 
    </div>   
    )
} 