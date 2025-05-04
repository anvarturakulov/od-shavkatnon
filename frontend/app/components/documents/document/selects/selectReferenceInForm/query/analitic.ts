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

        // if (typeReference == TypeReference.TMZ && item.refValues?.typeTMZ == 'PRODUCT') {
        //     const getValue = (jsonString: string | undefined, key: string) => {
        //         try{
        //           if (jsonString) {
        //             const object = JSON.parse(jsonString)
        //             if (key in object) return object[key]
        //           } 
        //           return undefined
        //         } catch {
        //           return undefined
        //         }
        //     }
            
        //     const value = getValue(item.refValues?.comment, 'common')
            
        //     if (value) {
        //         return false
        //     } 
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

