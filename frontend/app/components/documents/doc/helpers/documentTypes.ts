import { DocumentType } from "../../../../interfaces/document.interface";

export const docsDependentToBalance = [
  `${DocumentType.SaleProd}`,
  `${DocumentType.SaleMaterial}`,
  `${DocumentType.LeaveProd}`,
  `${DocumentType.LeaveMaterial}`,
  `${DocumentType.LeaveHalfstuff}`,
  `${DocumentType.MoveProd}`,
  `${DocumentType.MoveMaterial}`,
  `${DocumentType.MoveHalfstuff}`,
  `${DocumentType.ComeHalfstuff}`,
]

export const docsDependentToMiddlePrice = [
  `${DocumentType.SaleMaterial}`,
  `${DocumentType.LeaveMaterial}`,
  `${DocumentType.LeaveHalfstuff}`,
  `${DocumentType.MoveMaterial}`,
  `${DocumentType.MoveHalfstuff}`,
  `${DocumentType.ComeHalfstuff}`,
]

export const docsNotDependentToTotal = [
  `${DocumentType.MoveProd}`,
]

export const allDocs = [
  `${DocumentType.ComeMaterial}`,
  `${DocumentType.ComeProduct}`,
  `${DocumentType.ComeHalfstuff}`,
  `${DocumentType.SaleProd}`,
  `${DocumentType.SaleMaterial}`,
  `${DocumentType.LeaveProd}`,
  `${DocumentType.LeaveMaterial}`,
  `${DocumentType.LeaveHalfstuff}`,
  `${DocumentType.MoveProd}`,
  `${DocumentType.MoveMaterial}`,
  `${DocumentType.MoveHalfstuff}`,
  `${DocumentType.ComeCashFromPartners}`,
  `${DocumentType.MoveCash}`,
  `${DocumentType.LeaveCash}`,
  `${DocumentType.ZpCalculate}`,
]
