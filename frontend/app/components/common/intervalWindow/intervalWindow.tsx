import { IntervalProps } from "./intervalWindow.props";
import styles from './intervalWindow.module.css';
import { Button } from '../button/Button';
import { useState } from 'react';
import { Interval } from '@/app/interfaces/document.interface';
import { useAppContext } from '@/app/context/app.context';
import { dateNumberToString } from '@/app/service/common/converterForDates';

export const IntervalWindow = ({className, ...props}: IntervalProps): JSX.Element => {
  
  const {mainData, setMainData} = useAppContext();
  const [interval, setInterval] = useState<Interval>({...mainData.window.interval})

  const saveData = (interval: Interval, setMainData: Function | undefined) => {
    const {dateStart, dateEnd} = interval;
    const newInterval = {
      dateStart,
      dateEnd
    }

    if (dateStart <= dateEnd) {
      if (setMainData) {
        setMainData('interval', {...newInterval})
        setMainData('showIntervalWindow', false);
        setMainData('updateDataForDocumentJournal', false);  
      }
    }
    else {
      alert('Сана киритишда хатолик')
    }
  }

  const closeWindow = (setMainData: Function | undefined) => {
    setMainData && setMainData('showIntervalWindow', false);   
  }
  let currentDateStart = dateNumberToString(interval.dateStart)
  let currentDateEnd = dateNumberToString(interval.dateEnd)
  
  const changeElements = (e: React.FormEvent<HTMLInputElement>, setInterval: Function , interval:Interval) => {
        let target = e.currentTarget;
        let value = target.value;
        let id = target.id;
        let newInterval;

        if (id == 'dateStart') {
          newInterval = {
            ...interval,
            dateStart: Date.parse(value)
          }
        } else {
          newInterval = {
            ...interval,
            dateEnd: Date.parse(value) + 86399999
          }
        }
        setInterval(newInterval)

    }

  return (
      <>
          { mainData.window.showIntervalWindow && 
            <div className={styles.box}>
              <div>Интервал саналарини киритинг</div>
              <input 
                type='date' 
                className={styles.input} 
                id='dateStart' 
                value={currentDateStart}
                onChange={(e) => changeElements(e, setInterval, interval)}
              />
              <input 
                type='date' 
                className={styles.input} 
                id='dateEnd' 
                value={currentDateEnd}
                onChange={(e) => changeElements(e, setInterval, interval)}
              />
              <div className={styles.btnBox}>
                <Button appearance='primary' onClick={() => saveData(interval, setMainData)}> Саклаш </Button>
                <Button appearance='ghost' onClick={() => closeWindow(setMainData)}> Чикиш </Button>
              </div>
            </div>
          }
      </>
  )
}