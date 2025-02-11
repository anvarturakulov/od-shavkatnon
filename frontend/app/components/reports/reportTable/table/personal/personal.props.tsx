import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface PersonalProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  // listFirstSubconts: Array<string> | undefined,
  data: any,
}