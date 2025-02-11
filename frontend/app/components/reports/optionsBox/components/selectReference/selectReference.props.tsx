import { TypeReference } from '@/app/interfaces/reference.interface';
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

export interface SelectReferenceProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    label: string,
    typeReference: TypeReference,
    visible: boolean,
}