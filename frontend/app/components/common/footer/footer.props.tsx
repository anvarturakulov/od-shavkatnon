import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface FooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  windowFor: 'document' | 'reference' | 'order',
  count?: number,
  total?: number,
  docCount?: number,
  label?: string
}