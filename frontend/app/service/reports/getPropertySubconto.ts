import { ReferenceModel } from '@/app/interfaces/reference.interface'

export const getPropertySubconto = (data: any, subcontoId: string | undefined) => {
  let elem
  if (data && data.length > 0 && subcontoId) {
   elem = data.find((item: ReferenceModel) => item._id == subcontoId)
  }

  return {
    ...elem
  }
}