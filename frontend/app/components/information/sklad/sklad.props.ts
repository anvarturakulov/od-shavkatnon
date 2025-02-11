import { DetailedHTMLProps, HTMLAttributes } from "react";
import { SectionType } from '../information.props';

export interface SkladProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: any;
  sectionType : SectionType,
  currentSection?: string
}