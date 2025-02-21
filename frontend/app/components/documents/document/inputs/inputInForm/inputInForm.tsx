import { InputInFormProps } from './inputInForm.props';
import styles from './inputInForm.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { Maindata } from '@/app/context/app.context.interfaces';
import { NameControl } from '@/app/interfaces/document.interface';

export const InputInForm = ({visible, label, className, nameControl, isNewDocument, ...props }: InputInFormProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { currentDocument } = mainData.document;
    const { user } = mainData.users;
    const { contentName } = mainData.window;
    
    let currentVal = currentDocument.docValue[nameControl]

    const changeElements = (e: React.FormEvent<HTMLInputElement>, setMainData: Function | undefined, mainData: Maindata, nameControl: NameControl) => {
        let target = e.currentTarget;
        let value = target.value;
        let {currentDocument} = mainData.document;
        let newValues = {
            ...currentDocument
        }
        
        if ( nameControl=='count' && (+value>-1)) {
            newValues = {
                ...currentDocument,
                docValue: {
                    ...currentDocument.docValue,
                    [`${nameControl}`]: Number(Number(value).toFixed(3)),
                    total : Number((Number(value) * currentDocument.docValue.price).toFixed(2))
                }
            }
        }

        if ( nameControl=='price') {
            newValues = {
                ...currentDocument,
                docValue: {
                    ...currentDocument.docValue,
                    [`${nameControl}`]: Number(value),
                    total : Number((Number(value)* currentDocument.docValue.count).toFixed(2))
                }
            }
        }

        if ( nameControl=='total' ) {
            newValues = {
                ...currentDocument,
                docValue: {
                    ...currentDocument.docValue,
                    total : Number(value)
                }
            }
        }
        
        if (nameControl=='comment') {
            newValues = {
                ...currentDocument,
                docValue: {
                    ...currentDocument.docValue,
                    [nameControl]: value
                }
            }
        }

        if (nameControl=='cashFromPartner') {
            newValues = {
                ...currentDocument,
                docValue: {
                    ...currentDocument.docValue,
                    [nameControl]: Number(value)
                }
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
