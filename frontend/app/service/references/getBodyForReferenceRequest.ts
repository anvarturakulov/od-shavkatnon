import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { stat } from 'fs';

export const getBodyForReferenceRequest = (state: ReferenceModel, typeReference: TypeReference) => {
  let newReq = {
    name: state.name,
    comment: state.comment,
    typeReference,
  }
  switch (typeReference) {
    case TypeReference.CHARGES:
      return {
        ...newReq,
        longCharge: state.longCharge,
        shavkat: state.shavkat
      };
    case TypeReference.PARTNERS:
      return {
        ...newReq,
        typePartners: state.typePartners,
        clientForDeliveryId: state.clientForDeliveryId
      };;
    case TypeReference.PRICES:
      return {
        ...newReq,
      };
    case TypeReference.STORAGES:
      return {
        ...newReq,
        delivery: state.delivery,
        filial: state.filial,
        sklad: state.sklad,
        buxgalter: state.buxgalter,
        umumBulim: state.umumBulim,
        director: state.director,
        shavkat: state.shavkat,
        maxsud: state.maxsud
      };
    case TypeReference.TMZ:
      return {
        ...newReq,
        typeTMZ: state.typeTMZ,
        unit: state.unit,
        un: state.un,
        firstPrice: state.firstPrice,
        secondPrice: state.secondPrice,
        thirdPrice: state.thirdPrice,
        norma: state.norma
      };
    case TypeReference.WORKERS:
      return {
        ...newReq,
        telegramId: state.telegramId
      };
    default:
      return {};
  }
}