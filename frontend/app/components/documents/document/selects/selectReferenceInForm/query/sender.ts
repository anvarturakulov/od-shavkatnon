import { ReferenceModel, TypePartners, TypeReference, TypeSECTION } from "@/app/interfaces/reference.interface"
import { DocumentType } from '@/app/interfaces/document.interface';
import { Maindata } from "@/app/context/app.context.interfaces";
import { UserRoles } from "@/app/interfaces/user.interface";


export const sender = (item: ReferenceModel, type: string, contentName: string, typeReference: TypeReference, mainData: Maindata ): boolean => {
    
    const { user } = mainData.users;
    
    if (type == 'sender') {
        
        if (contentName == DocumentType.ComeProduct ) {
            return (item.refValues?.typeSection == TypeSECTION.TANDIR)
        }

        if (contentName == DocumentType.LeaveCash) {
            if ( user?.role == UserRoles.ADMIN || user?.role == UserRoles.HEADCOMPANY ) {
                return (
                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                item.refValues?.typeSection == TypeSECTION.ACCOUNTANT || 
                item.refValues?.typeSection == TypeSECTION.FOUNDER ||
                item.refValues?.typeSection == TypeSECTION.DIRECTOR ||
                item.refValues?.typeSection == TypeSECTION.STORAGE
                ) 
            } 
        }

        if ( contentName == DocumentType.LeaveMaterial || 
              contentName == DocumentType.LeaveHalfstuff || 
              contentName == DocumentType.LeaveProd ||
              contentName == DocumentType.SaleMaterial ||
              contentName == DocumentType.SaleHalfStuff ) {
                
            return (
                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                item.refValues?.typeSection == TypeSECTION.STORAGE
            ) 
        }

        if ( contentName == DocumentType.SaleProd) {
            return (
                item.refValues?.typeSection == TypeSECTION.FILIAL ||
                item.refValues?.typeSection == TypeSECTION.DELIVERY
            ) 
        }

        if ( contentName == DocumentType.ComeMaterial || contentName == DocumentType.ComeCashFromPartners || 
            contentName == DocumentType.ComeProductImport ) {

            return ( item.refValues?.typePartners == TypePartners.SUPPLIERS ) 
        }
        
        if ( typeReference == TypeReference.CHARGES &&
            contentName == DocumentType.ServicesFromPartners ) {
                
            return !item.refValues?.longCharge
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

