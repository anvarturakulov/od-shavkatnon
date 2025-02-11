import styles from './headerForUsers.module.css'
import { HeaderForUsersProps } from './headerForUsers.props'
import AddIco from './add.svg'
import CloseIco from './close.svg'
import { useAppContext } from '@/app/context/app.context';
import cn from 'classnames';
import { Maindata } from '@/app/context/app.context.interfaces';

export default function HeaderForUser({ className, ...props }: HeaderForUsersProps): JSX.Element {
    
    const {mainData, setMainData} = useAppContext()
    const {contentType, contentName, showUserWindow, isNewUser } = mainData 
    const strFirst = isNewUser ? 'янги фойдаланувчи очиш' : 'фойдаланувчиларни куриш';

    const addNewElement = (setMainData: Function | undefined, mainData: Maindata) => {
        if (setMainData) {
            setMainData('clearControlElements', false);
            setMainData('showUserWindow', true);
            setMainData('isNewUser' , true);
        }
    }

    return (
        <>
            {
                <div className={styles.box}>
                    <div className={cn(styles.title, 
                                    {[styles.newWindow] : isNewUser})}
                        >{strFirst}
                    </div>
                    
                    <div>
                        { showUserWindow ? 
                        <CloseIco 
                            className={styles.ico}
                            onClick={() => {
                                if (setMainData) {
                                    setMainData('clearControlElements', true);
                                    setMainData('showUserWindow', false);
                                    setMainData('isNewUser', false);                                    
                                    }
                                }}
                        />
                        :
                        <>
                        <AddIco 
                            className={styles.ico}
                            onClick={() => addNewElement(setMainData, mainData)} 
                            />
                        </>
                    }
                    </div>
                </div>
            }
        </>
    )
}

