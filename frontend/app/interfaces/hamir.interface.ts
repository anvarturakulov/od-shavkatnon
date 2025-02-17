export interface HamirModel {
  _id?: string
  date: number
  order?: number
  user: string
  sectionId: number
  analiticId: number
  firstWorker?: number | null,
  secondWorker?: number | null,
  thirdWorker?: number | null,
  zuvala?: number,
}
