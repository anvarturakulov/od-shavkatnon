import { DocSTATUS } from "./document.interface"

export interface HamirModel {
  id?: number
  date: number
  order?: number
  user: string
  sectionId: number
  analiticId: number
  firstWorker?: number | null,
  secondWorker?: number | null,
  thirdWorker?: number | null,
  zuvala?: number,
  docStatus: DocSTATUS
}
