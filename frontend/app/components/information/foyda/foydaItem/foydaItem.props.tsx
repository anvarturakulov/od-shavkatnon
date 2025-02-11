import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface FoydaItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  currentSectionId: string | undefined,
  data: any,
  title: string
}