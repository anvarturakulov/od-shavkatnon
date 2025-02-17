import { DetailedHTMLProps, HTMLAttributes } from "react";
import { SectionType } from '../inform.props';

export interface SkladProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: any,
  currentSection?: string
}