import { InputInTableProps } from './inputInTable.props';
import styles from './inputInTable.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { Maindata } from '@/app/context/app.context.interfaces';

export const InputInTable = ({ className, nameControl, itemIndexInTable, ...props }: InputInTableProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const { currentDocument } = mainData.document;
    let currentVal;
    if (currentDocument.docTableItems) {
        currentVal = currentDocument.docTableItems[itemIndexInTable][nameControl]
    }

    const changeElements = (e: React.FormEvent<HTMLInputElement>, nameControl:string, itemIndex: number, setMainData: Function | undefined, mainData: Maindata) => {
        let target = e.currentTarget;
        let {currentDocument} = mainData.document;

        if (currentDocument && currentDocument.docTableItems) {
            
            let currentItem = {...currentDocument.docTableItems[itemIndex]}
            let value = target.value

            if (currentItem && value != null && (nameControl=='count' || nameControl=='price' || nameControl=='total')) {
                currentItem[nameControl] = parseFloat(value)
            }

            if (currentItem && value != null && (nameControl=='count' || nameControl=='price')) {
                currentItem.total = +(currentItem.count * currentItem.price).toFixed(2)
            }

            if (currentItem && value != null && (nameControl=='comment')) {
                currentItem.comment = value
            }

            let newItems = [...currentDocument.docTableItems]
            newItems[itemIndex] = {...currentItem}
            let newObj = {
                ...currentDocument,
                docTableItems: [...newItems]
            }
            
            if ( setMainData ) {
                setMainData('currentDocument', {...newObj})
            }
        }
        
    }

    return (
        <div className={styles.box}>
            <input
                className={cn(className, styles.input)}
                {...props}
                onChange={(e) => changeElements(e, nameControl, itemIndexInTable, setMainData, mainData)}
                
                value={currentVal}
            />
        </div>
    );
};