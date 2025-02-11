import { UserRoles } from "../interfaces/general.interface";
import { DashboardReportItem } from "../interfaces/report.interface";

export const DashboardReportData:Array<DashboardReportItem> = [
    {
        title: 'Умум. пул окими',
        code: 'Financial',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        title: 'Дебитор кредитор',
        code: 'DebitorKreditor',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        title: 'Фойда хисоби',
        code: 'Foyda',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        title: 'Касса-жавобгар шахслар',
        code: 'Cash',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },
    {
        title: 'Накд пул кирими',
        code: 'Taking',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
    },
    {
        title: 'Накд пул харажати',
        code: 'Giving',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
    },
    {
        title: 'Бухгалтерлар хисоби',
        code: 'Section-buxgalter',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST, UserRoles.KASSIR]
    },
    {
        title: 'Филиаллар хисоби',
        code: 'Section-filial',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.HEADSECTION, UserRoles.GUEST]
    },
    {
        title: 'Юк етказиб берувчилар хисоби',
        code: 'Section-delivery',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.HEADSECTION, UserRoles.DELIVERY, UserRoles.GUEST]
    },
    {
        title: 'Омборхона',
        code: 'Sklad',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
    },
    {
        title: 'Норма',
        code: 'Norma',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.ZAMGLBUX, UserRoles.GUEST]
    },
    {
        title: 'Умум хом аше харажати',
        code: 'Material',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GLBUX, UserRoles.GUEST]
    },
    {
        title: 'Таъсисчилар',
        code: 'Section-founder',
        roles: [UserRoles.HEADCOMPANY, UserRoles.ADMIN, UserRoles.GUEST]
    },

    
           
]