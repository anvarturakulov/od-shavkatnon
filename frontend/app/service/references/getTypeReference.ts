import { MenuData } from '../../data/menu';
import { TypeReference } from '../../interfaces/reference.interface';

export const getTypeReference = (description: string): TypeReference => {
  const title = MenuData.filter(item => item.title == 'Руйхатлар')[0].subMenu.filter(el => el.title == description)[0]?.title

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