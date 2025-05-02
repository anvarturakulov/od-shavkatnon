import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface OrderJournalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  user?: string
}