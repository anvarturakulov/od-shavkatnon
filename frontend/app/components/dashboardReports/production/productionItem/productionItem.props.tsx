import { DetailedHTMLProps, HTMLAttributes } from "react";
import { SectionType } from '../../inform.props';

export interface ProductionItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  item: any
}