import { InputForDataProps } from './inputForData.props';
import styles from './inputForData.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { Maindata } from '@/app/context/app.context.interfaces';
import { adminAndHeadCompany, UserRoles } from '@/app/interfaces/general.interface';

export const InputForData = ({label, className, ...props }: InputForDataProps): JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { currentDocument } = mainData;
    const role = mainData.user?.role;
    const isAdminOrHeadCompany = role && adminAndHeadCompany.includes(role)
    
    let dateDoc = currentDocument.date>0 ? 
        new Date(currentDocument.date) : 
        new Date();

    let currentVal = dateDoc.toISOString().split('T')[0]

    const changeElements = (e: React.FormEvent<HTMLInputElement>, setMainData: Function | undefined, mainData: Maindata) => {
        let target = e.currentTarget;
        const role = mainData.user?.role;
        let value = target.value;
        let {currentDocument} = mainData;
        const valueDate = Date.parse(value)
        
        let newObj = {
            ...currentDocument,
            date: valueDate,
        }

        const oneDay = 24 * 60 * 60 * 1000
        const now = Date.now()
        const remainDate = now % oneDay
        const startDateToday = now - remainDate
        const yesterDay = startDateToday - oneDay

        if (role == UserRoles.GLBUX && valueDate < yesterDay ) return

        if ( setMainData ) {
            setMainData('currentDocument', {...newObj})
        }
    }

    return (
        <div className={styles.box}>
            {label !='' && <div className={styles.label}>{label}</div>}
            <input
                className={cn(className, styles.input)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData)}
                type='date'
                value={currentVal}
                disabled = {!isAdminOrHeadCompany}
            />
        </div>
    );
};
