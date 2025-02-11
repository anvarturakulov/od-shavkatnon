import { DocumentType } from "./document.interface"
import { ContentType, ServiceType, UserRoles } from "./general.interface"
import { TypeReference } from './reference.interface'
import { ReportType } from './report.interface'

interface MenuSubItem {
    title: DocumentType | TypeReference | ServiceType | ReportType,
    description: string,
    type: ContentType,
    active:boolean,
    roles: Array<UserRoles>
}

export interface MenuItem {
    title: string,
    isOpened: boolean,
    subMenu: Array<MenuSubItem>
}
