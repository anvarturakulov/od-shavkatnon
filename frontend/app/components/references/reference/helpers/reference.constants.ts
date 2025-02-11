import { TypePartners, TypeTMZ } from '@/app/interfaces/reference.interface'

export const typePartnersList = [
  { name: '', title: 'Хамкор турини танланг' },
  { name: TypePartners.CLIENTS, title: 'Мижоз' },
  { name: TypePartners.SUPPLIERS, title: 'Таъминотчи' }
]

export const typeTMZList = [
  { name: '', title: 'ТМБ турини танланг' },
  { name: TypeTMZ.PRODUCT, title: 'Тайёр махсулот' },
  { name: TypeTMZ.MATERIAL, title: 'Материал*' },
  { name: TypeTMZ.HALFSTUFF, title: 'Ярим тайёр махсулот' }
]

export interface DataForSelect {
  name: string,
  title: string
}