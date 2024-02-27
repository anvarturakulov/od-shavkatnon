import { checkBoxForReferenceProps } from './checkBoxForReference.props';
import styles from './checkBoxForReference.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { ReferenceBody } from '@/app/interfaces/reference.interface';

export const CheckBoxForReference = ({ className, checked, setCheckbox, label, id, ...props }: checkBoxForReferenceProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    
    const changeElements = (e: React.FormEvent<HTMLInputElement>, setCheckbox: Function, id: string) => {
        let target = e.currentTarget;
        setCheckbox(target.checked, id)
    }

    return (
        <div className={styles.box}>
            <input
                className={cn(className, styles.input)}
                {...props}
                onChange={(e) => changeElements(e, setCheckbox, id)}
                type='checkbox'
                checked={checked}
                id={id}
                />
            {label !='' && <label htmlFor={id} className={styles.label}>{label}</label>}
        </div>
    );
};