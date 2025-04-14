import { TypeReference } from '@/app/interfaces/reference.interface';
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

export interface SelectReferenceForTandirsProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    data: any,
    idForSelect: string,
    currentItemId: number | undefined,
    disabled: boolean
}