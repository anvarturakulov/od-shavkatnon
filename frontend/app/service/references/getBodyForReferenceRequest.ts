import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { stat } from 'fs';

export const getBodyForReferenceRequest = (state: ReferenceModel, typeReference: TypeReference) => {
  
  const {refValues} = state
  
  let newReq = {
    name: state.name,
    typeReference,
    refValues : {
      comment: refValues.comment,
    },
  }
  switch (typeReference) {
    case TypeReference.CHARGES:
      return {
        ...newReq,
        refValues: {
          longCharge: refValues.longCharge,
          shavkatCharge: refValues.shavkatCharge
        }
      };
    case TypeReference.PARTNERS:
      return {
        ...newReq,
        refValues: {
          typePartners: refValues.typePartners,
          clientForSectionId: refValues.clientForSectionId
        }
      };;
    case TypeReference.PRICES:
      return {
        ...newReq,
      };
    case TypeReference.STORAGES:
      return {
        ...newReq,
        refValues: {
          shavkatCharge : refValues.shavkatCharge,
          typeSection: refValues.typeSection
        }
        
      };
    case TypeReference.TMZ:
      return {
        ...newReq,
        refValues: {
          typeTMZ: refValues.typeTMZ,
          unit: refValues.unit,
          un: refValues.un,
          firstPrice: refValues.firstPrice,
          secondPrice: refValues.secondPrice,
          thirdPrice: refValues.thirdPrice,
          norma: refValues.norma
        }
      };
    case TypeReference.WORKERS:
      return {
        ...newReq,
        refValues: {
          telegramId: refValues.telegramId
        }
      };
    default:
      return {};
  }
}