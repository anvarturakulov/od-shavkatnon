import { CheckboxIdTypes, checkBoxInFormProps } from './checkBoxInForm.props';
import styles from './checkBoxInForm.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { Maindata } from '@/app/context/app.context.interfaces';

export const CheckBoxInTable = ({ className, id, label, ...props }: checkBoxInFormProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { currentDocument } = mainData;
    let currentVal
    if (currentDocument) {
        
        if (id == 'partner') {
            currentVal = currentDocument['isPartner']
        } 
        if (id == 'worker') {
            currentVal = currentDocument['isWorker']
        }
        if (id == 'founder') {
            currentVal = currentDocument['isFounder']
        }

        if (id == 'cash') {
            currentVal = currentDocument['isCash']
        }

        if (id == 'proveden') {
            currentVal = currentDocument['proveden']
        }
    }

    const changeElements = (e: React.FormEvent<HTMLInputElement>, setMainData: Function | undefined, mainData: Maindata, id: CheckboxIdTypes) => {
        let target = e.currentTarget;
        let currentValues = {...currentDocument}
        if (currentDocument) {
            if (id == 'partner') {
                currentValues.isPartner = target.checked
                if (target.checked) {
                    currentValues.isWorker = false
                    currentValues.isFounder = false
                }
            } 
            if (id == 'worker') {
                currentValues.isWorker = target.checked
                if (target.checked) {
                    currentValues.isPartner = false
                    currentValues.isFounder = false
                }
            }

            if (id == 'founder') {
                currentValues.isFounder = target.checked
                if (target.checked) {
                    currentValues.isPartner = false
                    currentValues.isWorker = false
                }
            }

            if (id == 'cash') {
                currentValues.isCash = target.checked
            }

            if (id == 'proveden') {
                currentValues.proveden = target.checked
            }

            
            if ( setMainData ) {
                setMainData('currentDocument', {...currentValues})
            }
        }
    }

    return (
        <div className={styles.box}>
            <input
                className={cn(className, styles.input)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData, id)}
                type='checkbox'
                checked={currentVal}
                id={id}
                />
            {label !='' && <label htmlFor={id} className={styles.label}>{label}</label>}
        </div>
    );
};
