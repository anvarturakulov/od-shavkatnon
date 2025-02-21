import { TypeReference } from '@/app/interfaces/reference.interface';
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

export interface SelectReferenceInTableProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    typeReference: TypeReference,
    itemIndexInTable: number,
    currentItemId: number,
    selectForReciever?: boolean,
}