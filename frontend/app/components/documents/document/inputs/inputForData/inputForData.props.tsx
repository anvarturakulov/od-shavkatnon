import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputForDataProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label: string,
    id: string,
}
