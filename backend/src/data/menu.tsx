import { DocumentType } from '../interfaces/document.interface';

export const MenuData = [
    { title: DocumentType.ComeMaterial, description:'Хом ашё кирими'},
    { title: DocumentType.MoveMaterial, description:'Хом ашё силжиши'},
    { title: DocumentType.LeaveMaterial, description:'Хом ашё чикими'},
    { title: DocumentType.SaleMaterial, description:'Хом ашё сотуви'},
    { title: DocumentType.ComeHalfstuff, description:'Я.Т.М ишлаб чикариш'},
    { title: DocumentType.MoveHalfstuff, description:'Я.Т.М силжиши'},
    { title: DocumentType.LeaveHalfstuff, description:'Я.Т.М чикими'},
    { title: DocumentType.ComeProduct, description:'Махсулот тайёрлаш'},
    { title: DocumentType.MoveProd, description:'Махсулот силжиши'},
    { title: DocumentType.LeaveProd, description:'Махсулот чикими '},
    { title: DocumentType.SaleProd, description:'Махсулот сотуви'},
    { title: DocumentType.ComeCashFromPartners, description:'Пул кирими (хамкорлар)'},
    { title: DocumentType.MoveCash, description:'Пул силжиши'},
    { title: DocumentType.LeaveCash, description:'Пул харажати'},
    { title: DocumentType.ZpCalculate, description:'Иш хаки хисоблаш'},
]

export const getDescriptionDocument = (name: string): string => {
  return MenuData.filter(el => el.title == name)[0]?.description
}