import { DocumentType } from "../interfaces/document.interface";
import {ServiceType } from "../interfaces/general.interface";
import { MenuItem } from "../interfaces/menu.interface";
import { OrderTypeTitle } from "../interfaces/order.interface";
import { TypeReference } from "../interfaces/reference.interface";
import { ReportType } from "../interfaces/report.interface";
import { UserRoles } from "../interfaces/user.interface";

export const MenuData:Array<MenuItem> = [
    {
        title: 'Хужжатлар',
        isOpened: true,
        subMenu: [
            { 
                title: DocumentType.ComeMaterial, description:'Хом ашё кирими', 
                type: 'document', active: false, 
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.MoveMaterial, description:'Хом ашё силжиши', 
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.LeaveMaterial, description:'Хом ашё чикими',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.ZAMGLBUX, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.SaleMaterial, description:'Хом ашё сотуви',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST, UserRoles.ZAMGLBUX, UserRoles.GLBUX]
            },
            { 
                title: DocumentType.ComeHalfstuff, description:'Я.Т.М ишлаб чикариш', 
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.MoveHalfstuff, description:'Я.Т.М силжиши',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.LeaveHalfstuff, description:'Я.Т.М чикими',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            {
                title: DocumentType.SaleHalfStuff, description:'Я.Т.М сотуви',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.ComeProduct, description:'Махсулот тайёрлаш',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.TANDIR, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.MoveProd, description:'Махсулот силжиши',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.HEADSECTION,
                 UserRoles.DELIVERY, UserRoles.SELLER, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.LeaveProd, description:'Махсулот чикими (брак / истемол)', 
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.HEADSECTION, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.SaleProd, description:'Махсулот сотуви',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.HEADSECTION, UserRoles.GLBUX, 
                 UserRoles.DELIVERY, UserRoles.SELLER, UserRoles.GUEST]
            },
            
            { 
                title: DocumentType.ComeProductImport, description:'Махсулотнинг хамкордан кирими',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST, UserRoles.ZAMGLBUX]
            },
            { 
                title: DocumentType.ComeCashFromPartners, description:'Пул кирими (таъминотчи ва хамкорлардан)',
                type: 'document', active: false,
                roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            
            { 
                title: DocumentType.MoveCash, description:'Пул силжиши',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.HEADSECTION, UserRoles.DELIVERY, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST, UserRoles.KASSIR]
            },
            { 
                title: DocumentType.LeaveCash, description:'Пул харажати',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.HEADSECTION, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.ZpCalculate, description:'Иш хаки хисоби',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST, UserRoles.ZP]
            },
            { 
                title: DocumentType.ServicesFromPartners, description:'Корхоналар хизмати',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.TakeProfit, description:'Фойда таксимоти',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN]
            },
        ]
    },
    {
        title: 'Бюртмалар',
        isOpened: false,
        subMenu: [
            { 
                title: DocumentType.Order, description:OrderTypeTitle.OPEN, 
                type: 'order', active:false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.Order, description:OrderTypeTitle.TOMORROW, 
                type: 'order', active:false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.Order, description:OrderTypeTitle.COMPLETED, 
                type: 'order', active:false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.Order, description:OrderTypeTitle.EXPIRED, 
                type: 'order', active:false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.Order, description:OrderTypeTitle.DELETED, 
                type: 'order', active:false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            
            { 
                title: DocumentType.ComeCashFromClients, description:'Буюртма - пул кирими',
                type: 'document', active: false,
                roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: DocumentType.SaleProdByOrder, description:'Буюртма - сотув',
                type: 'document', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.HEADSECTION, UserRoles.GLBUX]
            },


        ]
    },
    {
        title: 'Руйхатлар',
        isOpened: false,
        subMenu: [
            { 
                title: TypeReference.TMZ, description:'Товар моддий бойликлар', 
                type: 'reference', active:false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX]
            },
            { 
                title: TypeReference.STORAGES, description:'Цех ва омборхоналар',
                type: 'reference', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN] 
            },
            { 
                title: TypeReference.PARTNERS, description:'Хамкорлар', 
                type: 'reference', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX]
            },
            { 
                title: TypeReference.WORKERS, description:'Ходимлар',
                type: 'reference', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZP]
            },
            { 
                title: TypeReference.CHARGES, description:'Харажатлар',
                type: 'reference', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN]
            },

        ]
    },
    {
        title: 'Хисоботлар',
        isOpened: false,
        subMenu: [
            { 
                title: ReportType.MatOborot, description:'ТМБ харакати',
                type: 'report', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST, UserRoles.ZAMGLBUX]
            },
            { 
                title: ReportType.Oborotka, description:'Умумий айланма',
                type: 'report', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
            },
            { 
                title: ReportType.Personal, description:'Ходимлар иш хакиси буйича хисобот',
                type: 'report', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST, UserRoles.ZAMGLBUX]
            },
            { 
                title: ReportType.Clients, description:'Мижозлар тахлили',
                type: 'report', active: false,
                roles: 
                [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST, UserRoles.ZAMGLBUX]
            },
        ]
    },
    {
        title: 'Дастур',
        isOpened: false,
        subMenu: [
            { title: ServiceType.DeleteDocs, description:'Хужжатларни учириш', type: 'servis', active: false, roles: [UserRoles.ADMIN]},
            { title: ServiceType.Users, description:'Фойдаланувчилар', type: 'servis', active: false, roles: [UserRoles.ADMIN] },
            { title: ServiceType.Options, description:'Дастур хусусиятлари', type: 'servis', active: false, roles: [UserRoles.ADMIN] },
        ]
    }
]