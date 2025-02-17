import { TypeReference } from '@/app/interfaces/reference.interface';
import { DetailedHTMLProps, SelectHTMLAttributes } from "react";

export type TypeForSelectInForm = 'sender' | 'receiver' | 'analitic' | 'firstWorker' | 'secondWorker' | 'thirdWorker'

export interface SelectReferenceInFormProps extends DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
    label: string,
    typeReference: TypeReference,
    visibile?: boolean,
    currentItemId: string | undefined | null,
    type: TypeForSelectInForm,
    definedItemId?: string
}