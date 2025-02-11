import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface CashItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  currentSectionId: string | undefined,
  data: any,
  title: string
}