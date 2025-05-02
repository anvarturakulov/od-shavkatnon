import { ReferenceModel, TypePartners, TypeReference, TypeSECTION } from "@/app/interfaces/reference.interface"
import { DocumentType } from '@/app/interfaces/document.interface';
import { Maindata } from "@/app/context/app.context.interfaces";
import { UserRoles } from "@/app/interfaces/user.interface";


export const reciever = (item: ReferenceModel, type: string, contentName: string, typeReference: TypeReference, mainData: Maindata ): boolean => {
    
    const { user } = mainData.users;
    
    if (type == 'receiver') {
        if (contentName == DocumentType.ComeProduct ) {
            return (
                item.refValues?.typeSection == TypeSECTION.FILIAL  || 
                item.refValues?.typeSection == TypeSECTION.STORAGE
            ) 
        }

        if (contentName == DocumentType.ZpCalculate) {
            return (
                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                item.refValues?.typeSection == TypeSECTION.COMMON
            ) 
        }
        
        if (contentName == DocumentType.ServicesFromPartners) {
            return item.refValues?.typeSection == TypeSECTION.FILIAL 
        }
        
        if (contentName == DocumentType.ComeCashFromPartners) {
            if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                return (
                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ||
                item.refValues?.typeSection == TypeSECTION.FOUNDER
                ) 
            } 
            return ( item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ) 
        }

        if (contentName == DocumentType.ComeMaterial) {
            return ( 
                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                item.refValues?.typeSection == TypeSECTION.STORAGE
            ) 
        }

        if (contentName == DocumentType.SaleHalfStuff ) {
            return ( item.refValues?.typePartners == TypePartners.SUPPLIERS ) 
        }

        if (contentName == DocumentType.LeaveCash) {
            if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                return (
                    item.refValues?.typeSection == TypeSECTION.FILIAL || 
                    item.refValues?.typeSection == TypeSECTION.FOUNDER ||
                    item.refValues?.typeSection == TypeSECTION.COMMON || 
                    item.refValues?.typeSection == TypeSECTION.DIRECTOR ||
                    item.refValues?.typeSection == TypeSECTION.STORAGE
                ) 
            } else if (user?.role == UserRoles.GLBUX || user?.role == UserRoles.ZAMGLBUX) {
                return (
                    item.refValues?.typeSection == TypeSECTION.FILIAL ||
                    item.refValues?.typeSection == TypeSECTION.COMMON ||
                    item.refValues?.typeSection == TypeSECTION.STORAGE 
                )
            } else {
                return (
                    item.refValues?.typeSection == TypeSECTION.FILIAL || 
                    item.refValues?.typeSection == TypeSECTION.STORAGE || 
                    item.refValues?.typeSection == TypeSECTION.DELIVERY || 
                    item.refValues?.typeSection == TypeSECTION.ACCOUNTANT || 
                    item.refValues?.typeSection == TypeSECTION.COMMON
                )
            }
        }

        if (contentName == DocumentType.SaleProd && user?.role != UserRoles.HEADCOMPANY
            && user?.role != UserRoles.ADMIN ) {
            return item.refValues?.clientForSectionId == user?.sectionId
        }

        if (contentName == DocumentType.TakeProfit) {
            return (item.refValues?.typeSection == TypeSECTION.FOUNDER)
        }

        if (contentName == DocumentType.MoveProd) {
            return ( 
                item.refValues?.typeSection == TypeSECTION.FILIAL  ||
                item.refValues?.typeSection == TypeSECTION.DELIVERY || 
                item.refValues?.typeSection == TypeSECTION.STORAGE 
            ) 
        }

        if (contentName == DocumentType.MoveCash) {
            if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                return (
                    item.refValues?.typeSection == TypeSECTION.FILIAL ||
                    item.refValues?.typeSection == TypeSECTION.STORAGE ||
                    item.refValues?.typeSection == TypeSECTION.DELIVERY ||
                    item.refValues?.typeSection == TypeSECTION.ACCOUNTANT  ||
                    item.refValues?.typeSection == TypeSECTION.FOUNDER ||
                    item.refValues?.typeSection == TypeSECTION.DIRECTOR
                ) 
            } else  {
                return (
                    item.refValues?.typeSection == TypeSECTION.FILIAL ||
                    item.refValues?.typeSection == TypeSECTION.STORAGE ||
                    item.refValues?.typeSection == TypeSECTION.DELIVERY ||
                    item.refValues?.typeSection == TypeSECTION.ACCOUNTANT ||
                    item.refValues?.typeSection == TypeSECTION.DIRECTOR
                )
            } 
        }

        if ( contentName == DocumentType.MoveHalfstuff || 
            contentName == DocumentType.MoveMaterial ||
            contentName == DocumentType.ComeHalfstuff )
        {
            return (
                item.refValues?.typeSection == TypeSECTION.FILIAL  || 
                item.refValues?.typeSection == TypeSECTION.STORAGE
            ) 
        }
        
        return true
    }
    
    return false
}

