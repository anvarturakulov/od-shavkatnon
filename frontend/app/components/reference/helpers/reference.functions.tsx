import { ReferenceModel, TypePartners, TypeReference, TypeSECTION, TypeTMZ } from '@/app/interfaces/reference.interface';
import { showMessage } from '@/app/service/common/showMessage';
import { updateCreateReference } from '@/app/service/references/updateCreateReference';

export const cancelSubmit = (setMainData: Function | undefined) => {
    if (setMainData) {
        setMainData('clearControlElements', true);
        setMainData('showReferenceWindow', false);
        setMainData('isNewReference', false);
    }
}

export const onSubmit = (
    body: ReferenceModel,
    typeReference: TypeReference, 
    isNewReference: boolean, 
    setMainData: Function| undefined,
    token: string | undefined) => {


    if (typeReference == TypeReference.TMZ && body.refValues?.typeTMZ == undefined) {
        showMessage('ТМБ турини танланг', 'error', setMainData);
        return
    }
    
    if (body.name.trim().length != 0) {
        updateCreateReference(body, typeReference, isNewReference, setMainData, token);
    } else {
        showMessage('Номини тулдиринг', 'error', setMainData);
    }
}


export const defineTypeTMZ = (typeTMZ: string): TypeTMZ => {
    switch (typeTMZ) {
        case 'MATERIAL': return TypeTMZ.MATERIAL
        case 'PRODUCT': return TypeTMZ.PRODUCT
        case 'HALFSTUFF': return TypeTMZ.HALFSTUFF
        default: return TypeTMZ.MATERIAL
    } 
}

export const defineTypePartners = (typePartners: string): TypePartners => {
    switch (typePartners) {
        case 'CLIENTS': return TypePartners.CLIENTS
        case 'SUPPLIERS': return TypePartners.SUPPLIERS
        default: return TypePartners.CLIENTS
    } 
}

export const defineTypeSection = (typeSection: string): TypeSECTION => {
    switch (typeSection) {
        case 'ACCOUNTANT': return TypeSECTION.ACCOUNTANT
        case 'COMMON': return TypeSECTION.COMMON
        case 'DELIVERY': return TypeSECTION.DELIVERY
        case 'DIRECTOR': return TypeSECTION.DIRECTOR
        case 'FILIAL': return TypeSECTION.FILIAL
        case 'FOUNDER': return TypeSECTION.FOUNDER
        case 'STORAGE': return TypeSECTION.STORAGE
        case 'TANDIR': return TypeSECTION.TANDIR
        default: return TypeSECTION.DELIVERY
    } 
}