import { DetailedHTMLProps, HTMLAttributes } from "react";
import { SectionType } from '../information.props';

export interface SectionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: any;
  sectionType : SectionType,
  currentSection?: string
}