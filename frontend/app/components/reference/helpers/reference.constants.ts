import { TypePartners, TypeSECTION, TypeTMZ } from '@/app/interfaces/reference.interface'

export const typePartnersList = [
  { name: '', title: 'Хамкор турини танланг' },
  { name: TypePartners.CLIENTS, title: 'Мижоз' },
  { name: TypePartners.SUPPLIERS, title: 'Таъминотчи' }
]

export const typeTMZList = [
  { name: '', title: 'ТМБ турини танланг' },
  { name: TypeTMZ.PRODUCT, title: 'Тайёр махсулот' },
  { name: TypeTMZ.MATERIAL, title: 'Материал' },
  { name: TypeTMZ.HALFSTUFF, title: 'Ярим тайёр махсулот' }
]

export const typeSectionList = [
  { name: '', title: 'Булим турини танланг' },
  { name: TypeSECTION.ACCOUNTANT, title: 'Бош хисобчи' },
  { name: TypeSECTION.COMMON, title: 'Умум булим' },
  { name: TypeSECTION.DELIVERY, title: 'Юк етказиб берувчи' },
  { name: TypeSECTION.DIRECTOR, title: 'Директор' },
  { name: TypeSECTION.FILIAL, title: 'Филиал' },
  { name: TypeSECTION.FOUNDER, title: 'Таъсисчи' },
  { name: TypeSECTION.STORAGE, title: 'Склад' },
  { name: TypeSECTION.TANDIR, title: 'Тандир' },
]

export interface DataForSelect {
  name: string,
  title: string
}