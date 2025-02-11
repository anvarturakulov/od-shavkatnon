import { DetailedHTMLProps, HTMLAttributes } from "react";
import { SectionType } from '../../information.props';

export interface SkladItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  currentId: string | undefined,
  data: any,
  title: string,
  sectionType : SectionType
}