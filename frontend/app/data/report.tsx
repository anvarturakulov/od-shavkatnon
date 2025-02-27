import { DashboardReportItem } from "../interfaces/report.interface";
import { UserRoles } from "../interfaces/user.interface";

export const DashboardReportData:Array<DashboardReportItem> = [
    {
        title: 'Умум. пул окими',
        code: 'Financial',
        id: 1,
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        id: 2,
        title: 'Дебитор кредитор',
        code: 'DebitorKreditor',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        id: 3,
        title: 'Фойда хисоби',
        code: 'Foyda',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        id: 4,
        title: 'Касса-жавобгар шахслар',
        code: 'Cash',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        id: 5,
        title: 'Накд пул кирими',
        code: 'Taking',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
    },
    {
        id: 6,
        title: 'Накд пул харажати',
        code: 'Giving',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
    },
    {
        id: 7,
        title: 'Бухгалтерлар хисоби',
        code: 'Section-buxgalter',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST, UserRoles.KASSIR]
    },
    {
        id: 8,
        title: 'Филиаллар хисоби',
        code: 'Section-filial',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.HEADSECTION, UserRoles.GUEST]
    },
    {
        id: 9,
        title: 'Юк етказиб берувчилар хисоби',
        code: 'Section-delivery',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.HEADSECTION, UserRoles.DELIVERY, UserRoles.GUEST]
    },
    {
        id: 10,
        title: 'Омборхона',
        code: 'Sklad',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
    },
    {
        id: 11,
        title: 'Норма',
        code: 'Norma',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
    },
    {
        id: 12,
        title: 'Умум хом аше харажати',
        code: 'Material',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
    },
    {
        id: 13,
        title: 'Таъсисчилар',
        code: 'Section-founder',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },

    
           
]