import { InputInFormProps } from './inputInForm.props';
import styles from './inputInForm.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { Maindata } from '@/app/context/app.context.interfaces';
import { NameControl } from '@/app/interfaces/document.interface';

export const InputInForm = ({visible, label, className, nameControl, isNewDocument, ...props }: InputInFormProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { currentDocument, user, contentName } = mainData;
    
    let currentVal = currentDocument[nameControl]

    const changeElements = (e: React.FormEvent<HTMLInputElement>, setMainData: Function | undefined, mainData: Maindata, nameControl: NameControl) => {
        let target = e.currentTarget;
        let value = target.value;
        let {currentDocument} = mainData;
        let newValues = {
            ...currentDocument
        }
        
        if ( nameControl=='count' && (+value>-1)) {
            newValues = {
                ...currentDocument,
                [`${nameControl}`]: Number(Number(value).toFixed(3)),
                total : Number((Number(value) * currentDocument.price).toFixed(2))
            }
        }

        if ( nameControl=='price') {
            
            newValues = {
                ...currentDocument,
                [`${nameControl}`]: Number(value),
                total : Number((Number(value)* currentDocument.count).toFixed(2))
            }
        }

        if ( nameControl=='total' ) {
            newValues = {
                ...currentDocument,
                total : Number(value)
            }
        }
        
        if (nameControl=='comment') {
            newValues = {
                ...currentDocument,
                [nameControl]: value
            }
        }

        if (nameControl=='cashFromPartner') {
            newValues = {
                ...currentDocument,
                [nameControl]: Number(value)
            }
        }
                
        if ( setMainData ) {
            setMainData('currentDocument', {...newValues})
        }
    }
    
    if (visible == false) return <></>;
    
    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <input
                className={cn(className, styles.input, {
                    [styles.comment]: nameControl=='comment'
                })}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData, nameControl)}
                value={currentVal?currentVal:''}
            />
        </div>
    );
};
