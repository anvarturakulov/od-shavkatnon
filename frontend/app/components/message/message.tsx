import { MessageProps } from "./message.props";
import styles from './message.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import SmileIcon from './icons/smile.svg';
import ErrorIcon from './icons/oops.svg';
import { useEffect } from 'react';

export const Message = ({className, ...props}: MessageProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext()

    const {messageType, message, showMessageWindow} = mainData
    const label = messageType == 'error' ? 'Хатолик' : 'Рахмат';

    useEffect(() => {
        if (mainData.showMessageWindow) {
            setTimeout(()=>setMainData && setMainData('showMessageWindow', false), 12000)
        }
    }, [mainData.showMessageWindow])

    return (
        <>
            { 
                <div 
                    className={cn(styles.messageBox, className, {
                     [styles.error]: messageType == 'error',
                     [styles.success]: messageType == 'success',
                     [styles.showBox]: showMessageWindow,
                     })}
                     onClick={() => setMainData && setMainData('showMessageWindow', false)}
                     >
                    
                    { 
                        messageType != 'success' ? 
                            <ErrorIcon className={styles.icon}/>
                            :
                            <SmileIcon className={styles.icon}/>
                    }
                    
                    <div>
                        <div className={styles.label}>{label}</div>
                        <div className={styles.content}>{message}</div>
                    </div>
                </div>
            }
        </>
    )
}