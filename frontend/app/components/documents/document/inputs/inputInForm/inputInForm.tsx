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
    
    let currentVal = currentDocument.docValues[nameControl]

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
                docValues: {
                    ...currentDocument.docValues,
                    [`${nameControl}`]: Number(Number(value).toFixed(3)),
                    total : Number((Number(value) * currentDocument.docValues.price).toFixed(2))
                }
            }
        }

        if ( nameControl=='price') {
            newValues = {
                ...currentDocument,
                docValues: {
                    ...currentDocument.docValues,
                    [`${nameControl}`]: Number(value),
                    total : Number((Number(value)* currentDocument.docValues.count).toFixed(2))
                }
            }
        }

        if ( nameControl=='total' ) {
            newValues = {
                ...currentDocument,
                docValues: {
                    ...currentDocument.docValues,
                    total : Number(value)
                }
            }
        }
        
        if (nameControl=='comment' || nameControl=='orderAdress') {
            newValues = {
                ...currentDocument,
                docValues: {
                    ...currentDocument.docValues,
                    [nameControl]: value
                }
            }
        }

        if (nameControl=='cashFromPartner') {
            newValues = {
                ...currentDocument,
                docValues: {
                    ...currentDocument.docValues,
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
        <div className={cn(className, styles.box, {
            [styles.boxWithLabel]: label !=''
        })}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <input
                className={cn(className, styles.input, {
                    [styles.comment]: nameControl=='comment',
                })}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData, nameControl)}
                value={currentVal?currentVal:''}
            />
        </div>
    );
};
