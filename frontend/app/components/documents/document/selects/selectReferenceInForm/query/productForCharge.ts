import { ReferenceModel, TypePartners, TypeReference, TypeSECTION, TypeTMZ } from "@/app/interfaces/reference.interface"
import { Maindata } from "@/app/context/app.context.interfaces";
import { UserRoles } from "@/app/interfaces/user.interface";


export const productForCharge = (item: ReferenceModel, type: string, contentName: string, typeReference: TypeReference, mainData: Maindata ): boolean => {
    
    if (type == 'productForCharge') {
        return (item.refValues?.typeTMZ == TypeTMZ.PRODUCT)    
    }
    return false
}

