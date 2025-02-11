import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface FooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  windowFor: 'document' | 'reference',
  count?: number,
  total?: number,
  docCount?: number,
}