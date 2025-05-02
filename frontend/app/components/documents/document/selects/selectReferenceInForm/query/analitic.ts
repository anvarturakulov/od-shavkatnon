import { ReferenceModel, TypePartners, TypeReference, TypeSECTION } from "@/app/interfaces/reference.interface"
import { DocumentType } from '@/app/interfaces/document.interface';
import { Maindata } from "@/app/context/app.context.interfaces";
import { UserRoles } from "@/app/interfaces/user.interface";


export const analitic = (item: ReferenceModel, type: string, contentName: string, typeReference: TypeReference, mainData: Maindata ): boolean => {
    
    const { user } = mainData.users;
    const { currentDocument } = mainData.document;
    
    if (type == 'analitic') {
        if (typeReference == TypeReference.PARTNERS) {
            return item.refValues?.typePartners == TypePartners.SUPPLIERS 
        }

        // if (typeReference == TypeReference.TMZ && ) {
        //     return item.refValues?.typePartners == TypePartners.SUPPLIERS 
        // }

        if (typeReference == TypeReference.CHARGES) {
            if (user?.role == UserRoles.HEADSECTION) {
                return !item.refValues?.longCharge && !item.refValues?.shavkatCharge
            }

            if (currentDocument.docValues.senderId == 19948 || 
                currentDocument.docValues.senderId == 19949) {
                    return Boolean(item.refValues?.shavkatCharge)
            } 
            else {
                return !Boolean(item.refValues?.shavkatCharge)
            }
        }
        return true
    }
    return false
}

