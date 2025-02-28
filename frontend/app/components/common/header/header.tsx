import styles from './header.module.css'
import { HeaderProps } from './header.props'
import AddIco from './add.svg'
import DateIco from './date.svg'
import CloseIco from './close.svg'
import { useAppContext } from '@/app/context/app.context';
import cn from 'classnames';
import { Maindata } from '@/app/context/app.context.interfaces';
import { dateNumberToString } from '@/app/service/common/converterForDates'
import { setNewDocumentParams } from '@/app/service/documents/setNewDocumentParams'
import { UserRoles } from '@/app/interfaces/user.interface'

export default function Header({ windowFor ,className, count, total, ...props }: HeaderProps): JSX.Element {
    
    const {mainData, setMainData} = useAppContext()
    const {dateStart, dateEnd} = mainData.window.interval
    const {user} = mainData.users

    const {contentType, contentTitle, showReferenceWindow, isNewReference, showDocumentWindow, isNewDocument } = mainData.window 
    
    const strFirst =  
        contentType == 'document' ? 
            (isNewDocument) ?  'буйича янги хужжат тузиш':
                               'буйича хужжатни куриш'  
        : 
            (isNewReference) ? 'буйича янги элемент очиш':
                               'буйича элементни куриш';

    const strSecond =  contentType == 'document' ? 'буйича хужжатлар руйхати' : 'руйхати'

    let dateStartInStr = dateNumberToString(dateStart)
    let dateEndInStr = dateNumberToString(dateEnd)

    const addNewElement = (setMainData: Function | undefined, mainData: Maindata) => {
        if (setMainData) {
            setMainData('clearControlElements', false);
            setNewDocumentParams(setMainData, mainData)
            setMainData(windowFor == 'reference' ? 'showReferenceWindow': 'showDocumentWindow' , true);
            setMainData(windowFor == 'reference' ? 'isNewReference' : 'isNewDocument', true);
        }
    }

    return (
        <>
            {
                contentTitle ?
                <div className={styles.box}>
                    <div className={cn(styles.title, 
                                    {[styles.newWindow] : (isNewReference|| isNewDocument)})}
                        >{contentTitle} { ( showReferenceWindow || showDocumentWindow ) ? strFirst : strSecond }
                    </div>
                    
                    {
                        <div>{`оралик сана: ${dateStartInStr} дан ${dateEndInStr} гача`}</div>
                    }
                    <div>
                        {( showReferenceWindow || showDocumentWindow )? 
                        <CloseIco 
                            className={styles.ico}
                            onClick={() => {
                                if (setMainData) {
                                    setMainData('clearControlElements', true);
                                    setMainData(windowFor == 'reference' ? 'showReferenceWindow':'showDocumentWindow', false);
                                    setMainData(windowFor == 'reference' ? 'isNewReference': 'isNewDocument' , false);                                    
                                    }
                                }}
                                
                        />
                        :
                        <>
                                <DateIco 
                                    className={styles.ico}
                                    onClick={(mainData: Maindata) => {
                                        if (setMainData) {
                                            setMainData('showIntervalWindow', true);
                                            }
                                        }}
                                />
                                {
                                user?.role != UserRoles.GUEST &&
                                <AddIco 
                                    className={styles.ico}
                                    onClick={() => addNewElement(setMainData, mainData)} 
                                    />
                                }
                        </>
                        
                    }
                    </div>
                </div>
                :
                <div className={styles.box}>
                    <div className={styles.title}>Барча хужжатлар руйхати</div>
                </div>
            }
        </>
    )
}

