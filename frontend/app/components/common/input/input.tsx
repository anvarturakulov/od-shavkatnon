import { InputProps } from './input.props';
import styles from './input.module.css';
import cn from 'classnames';


export const Input = ({ label, visible=true, className, ...props }: InputProps): JSX.Element => {
    
    if (visible == false) return <></>

    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <input
                className={cn(className, styles.input)}
                {...props}
            />
        </div>
    );
};
