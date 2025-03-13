import { MessageProps } from "./message.props";
import styles from './message.module.css';
import cn from 'classnames';
import { useAppContext } from '@/app/context/app.context';
import { EntryItem } from '@/app/interfaces/report.interface';
import { secondsToDateString } from "../../documents/document/doc/helpers/doc.functions";

export const Message = ({className, ...props}: MessageProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext()

    const {messageType, message, showMessageWindow} = mainData.window
    const label = messageType == 'error' ? 'Хатолик' : messageType == 'success' ? 'Рахмат': '';

    return (
        <>
            {   typeof message == 'string' &&
                <div 
                    className={cn(styles.messageBox, className, {
                     [styles.error]: messageType == 'error',
                     [styles.success]: messageType == 'success',
                     [styles.warm]: messageType == 'warm',
                     [styles.showBox]: showMessageWindow,
                     })}
                     onClick={() => setMainData && setMainData('showMessageWindow', false)}
                     >
                    
                    <div>
                        {/* <div className={styles.label}>{label}</div> */}
                        {
                            typeof message == 'string' &&
                            <div className={styles.content}>{message}</div>
                        }
                    </div>
                </div>
            }

            {
                typeof message != 'string' &&
                <div 
                    className={cn(styles.messageBox, styles.success, styles.longBox, className, {
                     [styles.showBox]: showMessageWindow,
                     })}
                     onClick={() => setMainData && setMainData('showMessageWindow', false)}
                     >
                    <div>
                        {
                            message &&
                            message.length>0 && 
                            message.map((item: EntryItem, index: number)=> {
                                return (
                                        item.total > 0 &&
                                        <div key={index}>{`${index+1}. сана: ${secondsToDateString(item.date)} ${item.comment ? `изох ${item.comment}`:''} ${item.count>0 ? `сон: ${item.count}`: ''} сумма: ${item.total} (${item.documentType})`}</div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}