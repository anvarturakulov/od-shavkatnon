import { UserRoles } from '@/app/interfaces/general.interface'

export const userRolesList = [
  { name: '', title: 'Фойдаланувчи турини танланг' },
  { name: UserRoles.ADMIN, title: 'ADMIN' },
  { name: UserRoles.DELIVERY, title: 'DELIVERY' },
  { name: UserRoles.GLBUX, title: 'GLBUX' },
  { name: UserRoles.GUEST, title: 'GUEST' },
  { name: UserRoles.HEADCOMPANY, title: 'HEADCOMPANY' },
  { name: UserRoles.HEADSECTION, title: 'HEADSECTION' },
  { name: UserRoles.SELLER, title: 'SELLER' },
  { name: UserRoles.TANDIR, title: 'TANDIR' },
  { name: UserRoles.ZAMGLBUX, title: 'ZAMGLBUX' },
  { name: UserRoles.ZP, title: 'ZP'},
  { name: UserRoles.KASSIR, title: 'KASSIR'},
]

export interface DataForUserSelect {
  name: string,
  title: string
}