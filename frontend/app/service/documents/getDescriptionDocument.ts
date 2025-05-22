import { MenuData } from '../../data/menu';

export const getDescriptionDocument = (name: string): string => {
  const firstStage = MenuData.filter(item => item.title == 'Хужжатлар')[0].subMenu.filter(el => el.title == name)[0]?.description
  const secondStage = MenuData.filter(item => item.title == 'Бюртмалар')[0].subMenu.filter(el => el.title == name)[0]?.description
  return firstStage || secondStage 
}