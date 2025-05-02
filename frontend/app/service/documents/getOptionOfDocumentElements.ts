import { DocumentType, OptionsForDocument } from "../../interfaces/document.interface";
import { TypeReference } from '../../interfaces/reference.interface';

export const getOptionOfDocumentElements = (documentType: string): OptionsForDocument => {

    let senderType = TypeReference.STORAGES, senderLabel = '', senderIsVisible = false
    let receiverType = TypeReference.STORAGES, receiverLabel = '', recieverIsVisible = false  
    let analiticType = TypeReference.STORAGES , analiticLabel = '', analiticIsVisible = false
    let productForChargeType = TypeReference.TMZ, productForChargeLabel = '', productForChargeIsVisible = false
    
    let cashFromPartnerLabel = '' , cashFromPartnerVisible = false;
    let tableIsVisible = false;
    let balansIsVisible = true;
    
    let countIsVisible = true;
    let countIsDisabled = false;

    let priceIsVisible = true;
    let priceIsDisabled = false;
    
    let totalIsVisible = true;
    let totalIsDisabled = false;

    const documentsComeMaterial = [
        `${DocumentType.ComeMaterial}`,
    ]

    const documentsComeProduct = [
        `${DocumentType.ComeProduct}`,
    ]

    const documentsComeHalfstuff = [
        `${DocumentType.ComeHalfstuff}`,
    ]

    const documentsSaleProd = [
        `${DocumentType.SaleProd}`,
    ]

    const documentsSaleMaterial = [
        `${DocumentType.SaleMaterial}`,
    ]

    const documentsLeaveProd = [
        `${DocumentType.LeaveProd}`,
    ]

    const documentsLeaveMaterial = [
        `${DocumentType.LeaveMaterial}`,
    ]

    const documentsLeaveHalfstuff = [
        `${DocumentType.LeaveHalfstuff}`,
    ]

    const documentsMoveProd = [
        `${DocumentType.MoveProd}`,
    ]

    const documentsMoveMaterial = [
        `${DocumentType.MoveMaterial}`,
    ]

    const documentsMoveHalfstuff = [
        `${DocumentType.MoveHalfstuff}`,
    ]

    const documentsComeCashFromPartners = [
        `${DocumentType.ComeCashFromPartners}`,
    ]

    const documentsMoveCash = [
        `${DocumentType.MoveCash}`,
    ]

    const documentsLeaveCash = [
        `${DocumentType.LeaveCash}`,
    ]

    const documentsZpCalculate = [
        `${DocumentType.ZpCalculate}`,
    ]

    const documentsTakeProfit = [
        `${DocumentType.TakeProfit}`,
    ]

    const ServicesFromPartners = [
        `${DocumentType.ServicesFromPartners}`,
    ]

    const documentsSaleHalfStuff = [
        `${DocumentType.SaleHalfStuff}`,
    ]

    const documentsComeProductImport = [
        `${DocumentType.ComeProductImport}`,
    ]

    const documentsOrder = [
        `${DocumentType.Order}`,
    ]

    
    if (documentsComeMaterial.includes(documentType)) {
        senderType = TypeReference.PARTNERS
        senderLabel = 'Таъминотчи'
        senderIsVisible = true
        
        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Товар моддий бойлик'
        analiticIsVisible = true

        balansIsVisible = false;
    }

    if (documentsComeProduct.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Ишлаб чикарувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Товар моддий бойлик'
        analiticIsVisible = true

        priceIsVisible = false;
        totalIsVisible = false;
        balansIsVisible = false;
    }

    if (documentsComeProductImport.includes(documentType)) {
        senderType = TypeReference.PARTNERS
        senderLabel = 'Таъминотчи'
        senderIsVisible = true
        
        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Махсулот'
        analiticIsVisible = true

        balansIsVisible = false;
    }

    if (documentsComeHalfstuff.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Ишлаб чикарувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Я.Т.М'
        analiticIsVisible = true;

        priceIsVisible = false;
        totalIsVisible = false;
        balansIsVisible = false;
        tableIsVisible = true;
    }

    if (documentsSaleProd.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.PARTNERS
        receiverLabel = 'Мижоз'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Тайёр махсулот'
        analiticIsVisible = true

        totalIsDisabled = true;
    }

    if (documentsSaleMaterial.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи'
        senderIsVisible = true

        receiverType = TypeReference.PARTNERS
        receiverLabel = 'Мижоз'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Хом ашё'
        analiticIsVisible = true

        totalIsDisabled = true;
        priceIsDisabled = true;
    }

    if (documentsSaleHalfStuff.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи'
        senderIsVisible = true

        receiverType = TypeReference.PARTNERS
        receiverLabel = 'Мижоз'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'ЯТМ'
        analiticIsVisible = true

        totalIsDisabled = true;
        priceIsDisabled = false;
    }

    if (documentsLeaveProd.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.CHARGES
        receiverLabel = 'Харажат тури'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Тайёр махсулот'
        analiticIsVisible = true

        productForChargeType = TypeReference.TMZ
        productForChargeLabel = 'Харажат кайси махсулот учун'
        productForChargeIsVisible = true

        priceIsVisible = false;
        totalIsVisible = false;
    }

    if (documentsLeaveMaterial.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.CHARGES
        receiverLabel = 'Харажат тури'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Хом ашё'
        analiticIsVisible = false

        productForChargeType = TypeReference.TMZ
        productForChargeLabel = 'Харажат кайси махсулот учун'
        productForChargeIsVisible = true

        tableIsVisible = true

        countIsVisible = false;
        priceIsDisabled = true;
        totalIsDisabled = true;
        balansIsVisible = false;

    }

    if (documentsLeaveHalfstuff.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.CHARGES
        receiverLabel = 'Харажат тури'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Я.Т.М'
        analiticIsVisible = true

        productForChargeType = TypeReference.TMZ
        productForChargeLabel = 'Харажат кайси махсулот учун'
        productForChargeIsVisible = true

        totalIsDisabled = true;
        priceIsDisabled = true;
    }

    if (documentsMoveProd.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Тайёр махсулот'
        analiticIsVisible = true

        priceIsVisible = false;
        totalIsVisible = false;
    }

    if (documentsMoveMaterial.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи килувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Хом ашё'
        analiticIsVisible = true

        totalIsDisabled = true;
        priceIsDisabled = true;
    }

    if (documentsMoveHalfstuff.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Я.Т.М'
        analiticIsVisible = true

        priceIsDisabled = true;
        totalIsDisabled = true;

    }

    if (documentsComeCashFromPartners.includes(documentType)) {
        senderType = TypeReference.PARTNERS
        senderLabel = 'Хамкор'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = '-'
        analiticIsVisible = false;

        countIsVisible = false;
        priceIsVisible = false;
        balansIsVisible = false;
    }

    if (documentsMoveCash.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Кабул килувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = '-'
        analiticIsVisible = false

        countIsVisible = false;
        priceIsVisible = false;
        balansIsVisible = false;

    }

    if (documentsLeaveCash.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Харажатни олувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.CHARGES
        analiticLabel = 'Харажат тури'
        analiticIsVisible = true

        productForChargeType = TypeReference.TMZ
        productForChargeLabel = 'Харажат кайси махсулот учун'
        productForChargeIsVisible = true

        priceIsVisible = false;
        countIsVisible = false;
        balansIsVisible = false;

    }

    if (documentsZpCalculate.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = '{fhf;fn ,ekbvb}'
        senderIsVisible = false

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Харажатни олувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.WORKERS
        analiticLabel = 'Ходим'
        analiticIsVisible = true;

        productForChargeType = TypeReference.TMZ
        productForChargeLabel = 'Харажат кайси махсулот учун'
        productForChargeIsVisible = true

        priceIsVisible = false;
        countIsVisible = false;
        balansIsVisible = false;
    }

    if (documentsTakeProfit.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = '------'
        senderIsVisible = false

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Фойдани олувчи таъсисчи'
        recieverIsVisible = true

        analiticType = TypeReference.WORKERS
        analiticLabel = '-----'
        analiticIsVisible = false;

        priceIsVisible = false;
        countIsVisible = false;
        balansIsVisible = false;
    }

    if (ServicesFromPartners.includes(documentType)) {
        senderType = TypeReference.CHARGES
        senderLabel = 'Харажат тури'
        senderIsVisible = true

        receiverType = TypeReference.STORAGES
        receiverLabel = 'Харажатни олувчи булим'
        recieverIsVisible = true

        analiticType = TypeReference.PARTNERS
        analiticLabel = 'Корхона'
        analiticIsVisible = true;

        productForChargeType = TypeReference.TMZ
        productForChargeLabel = 'Харажат кайси махсулот учун'
        productForChargeIsVisible = true

        priceIsVisible = false;
        countIsVisible = false;
        balansIsVisible = false;
    }

    if (documentsOrder.includes(documentType)) {
        senderType = TypeReference.STORAGES
        senderLabel = 'Жунатувчи булим'
        senderIsVisible = true

        receiverType = TypeReference.PARTNERS
        receiverLabel = 'Мижоз'
        recieverIsVisible = true

        analiticType = TypeReference.TMZ
        analiticLabel = 'Тайёр махсулот'
        analiticIsVisible = true

        totalIsDisabled = true;
        balansIsVisible = false;
    }

    return {
        senderType,
        senderLabel,
        receiverType,
        receiverLabel,
        senderIsVisible,
        recieverIsVisible,
        analiticType,
        analiticLabel,
        analiticIsVisible,
        productForChargeType,
        productForChargeLabel,
        productForChargeIsVisible,
        cashFromPartnerLabel,
        cashFromPartnerVisible,
        tableIsVisible,
        countIsVisible,
        priceIsVisible,
        totalIsVisible,
        priceIsDisabled,
        totalIsDisabled,
        balansIsVisible
    }
}