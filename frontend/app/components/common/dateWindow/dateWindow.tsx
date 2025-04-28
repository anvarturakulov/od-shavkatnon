import { DateWindowProps } from "./dateWindow.props";
import styles from './dateWindow.module.css';
import { Button } from '../button/Button';
import { useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import { dateNumberToString } from '@/app/service/common/converterForDates';

export const DateWindow = ({className, ...props}: DateWindowProps): JSX.Element => {
  
  const {mainData, setMainData} = useAppContext();
  const [date, setDate] = useState<number>(0)

  const saveData = (date: number, setMainData: Function | undefined) => {
    if (date) {
      if (setMainData) {
        setMainData('dateForRequest', date)
        setMainData('showDateWindow', false);
        setMainData('goRequestByDate', true);
      }
    }
    else {
      alert('Сана киритишда хатолик')
    }
  }

  const closeWindow = (setMainData: Function | undefined) => {
    setMainData && setMainData('showDateWindow', false); 
    setMainData && setMainData('goRequestByDate', false);  
  }

  let now = dateNumberToString(Date.now())
  
  const changeElements = (e: React.FormEvent<HTMLInputElement>, setDate: Function) => {
        let target = e.currentTarget;
        let value = target.value;
        let id = target.id;
        let newDate;

        if (id == 'date') {
          newDate = Date.parse(value)
        }
        setDate(newDate)
    }

  return (
      <>
          { mainData.window.showDateWindow && 
            <div className={styles.box}>
              <div>Санани киритинг</div>
              <input 
                type='date' 
                className={styles.input} 
                id='date' 
                value={now}
                onChange={(e) => changeElements(e, setDate)}
              />
              
              <div className={styles.btnBox}>
                <Button appearance='primary' onClick={() => saveData(date, setMainData)}> Саклаш </Button>
                <Button appearance='ghost' onClick={() => closeWindow(setMainData)}> Чикиш </Button>
              </div>
            </div>
          }
      </>
  )
}