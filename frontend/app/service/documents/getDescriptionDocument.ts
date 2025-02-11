import { MenuData } from '../../data/menu';

export const getDescriptionDocument = (name: string): string => {
  return MenuData.filter(item => item.title == 'Хужжатлар')[0].subMenu.filter(el => el.title == name)[0]?.description
}