import { User, UserRoles } from "@/app/interfaces/user.interface"

export const isAdmins = (user: User | undefined): boolean => {
  if (user && (user.role == UserRoles.ADMIN || user.role == UserRoles.HEADCOMPANY)) return true
  return false
}

export const isUsersForProveden = (user: User | undefined): boolean => {
  if (user && (
      user.role == UserRoles.ADMIN || 
      user.role == UserRoles.HEADCOMPANY ||
      user.role == UserRoles.GLBUX || 
      user.role == UserRoles.ZP
    )) return true
  return false
}

export const isGuest = (user: User | undefined): boolean => {
  if (user && user.role == UserRoles.GUEST ) return true
  return false
}

export const isGlBuxs = (user: User | undefined): boolean => {
  if (user && (user.role == UserRoles.GLBUX || user.role == UserRoles.ZP)) return true
  return false
}