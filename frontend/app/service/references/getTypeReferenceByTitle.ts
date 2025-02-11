import { TypeReference } from '../../interfaces/reference.interface';

export const getTypeReferenceByTitle = (title: string): TypeReference => {
  switch (title) {
    case TypeReference.PARTNERS:
      return TypeReference.PARTNERS;
    case TypeReference.CHARGES:
      return TypeReference.CHARGES
    case TypeReference.PRICES:
      return TypeReference.PRICES;
    case TypeReference.STORAGES:
      return TypeReference.STORAGES;
    case TypeReference.TMZ:
      return TypeReference.TMZ;
    case TypeReference.WORKERS:
      return TypeReference.WORKERS;
    default:
      return TypeReference.PARTNERS
  }
}