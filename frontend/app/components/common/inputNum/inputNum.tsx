import { InputNumProps } from './inputNum.props';
import styles from './inputNum.module.css';
import cn from 'classnames';
import { useState } from 'react';


export const InputNum = ({ label, visible=true, className, ...props }: InputNumProps): JSX.Element => {
    
    const [val, setVal] = useState<string>('')
   
    if (visible == false) return <></>
    
    const triadaFunc = (e: React.FormEvent<HTMLInputElement>) => {
        let target = e.currentTarget
        let newValue = target.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        setVal(newValue);
    }

    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <input
                className={cn(className, styles.input)}
                value={val}
                {...props}
                onChange={(e) => triadaFunc(e)}
            />
        </div>
    );
};
