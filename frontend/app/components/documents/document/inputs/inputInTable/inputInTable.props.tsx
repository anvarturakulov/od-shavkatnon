import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface InputInTableProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    nameControl: 'count' | 'price' | 'total' | 'comment',
    itemIndexInTable: number,
}