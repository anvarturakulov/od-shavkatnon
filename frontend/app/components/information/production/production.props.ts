import { DetailedHTMLProps, HTMLAttributes } from "react";
import { SectionType } from '../information.props';

export interface ProductionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: any;
  currentSection?: string
}