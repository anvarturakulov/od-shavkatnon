export interface HamirModel {
  _id?: string
  date: number
  order?: number
  user: string
  sectionId: string
  analiticId: string
  proveden: boolean,
  firstWorker?: string | null,
  secondWorker?: string | null,
  thirdWorker?: string | null,
  zuvala?: number,
  fromHamirchi: boolean,
}
