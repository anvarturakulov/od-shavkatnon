import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface HeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  windowFor: 'document' | 'reference',
  count?: number,
  total?: number
}