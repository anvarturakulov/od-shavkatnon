import { DocumentType } from "./document.interface"
import { ContentType, ServiceType } from "./general.interface"
import { OrderTypeTitle } from "./order.interface"
import { TypeReference } from './reference.interface'
import { ReportType } from './report.interface'
import { UserRoles } from "./user.interface"

interface MenuSubItem {
    title: DocumentType | TypeReference | ServiceType | ReportType | OrderTypeTitle
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
