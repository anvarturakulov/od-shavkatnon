import { ReferenceModel } from '@/app/interfaces/reference.interface'

export function sortByName (a: ReferenceModel, b: ReferenceModel): Number {
  let nameA = a.name != null ? a.name.toLocaleLowerCase(): ''
  let nameB = b.name != null ? b.name.toLocaleLowerCase(): ''
  if (nameA < nameB) return -1
  if (nameA > nameB) return 1
  return 0
}
