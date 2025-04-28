import styles from './duplicateWindow.module.css';
import { Button } from '../button/Button';
import { useState } from 'react';
import { useAppContext } from '@/app/context/app.context';
import { dateNumberToString } from '@/app/service/common/converterForDates';
import { DatesForDuplicateDocs } from "@/app/interfaces/document.interface";
import { defaultDatesForDuplicateDocs } from "@/app/context/app.context.constants";
import { DuplicateWindowProps } from './duplicateWindow.props';

export const DuplicateWindow = ({className, ...props}: DuplicateWindowProps): JSX.Element => {
  
  const {mainData, setMainData} = useAppContext();
  const [datesForDuplicateDocs, setDatesForDuplicateDocs] = useState<DatesForDuplicateDocs>({...mainData.window.datesForDuplicateDocs})

  const saveData = (datesForDuplicateDocs: DatesForDuplicateDocs, setMainData: Function | undefined) => {
    const {dateFrom, dateTo} = datesForDuplicateDocs;
    if (from < to) {
      if (setMainData) {
        setMainData('datesForDuplicateDocs', {...datesForDuplicateDocs})
        setMainData('showDatesDuplicateWindow', false);
        setMainData('goRequestByDuplicateDocs', true);  
      }
    }
    else {
      alert('Сана киритишда хатолик')
    }
    
  }

  const closeWindow = (setMainData: Function | undefined) => {
    if (setMainData) {
      setMainData('datesForDuplicateDocs', {...defaultDatesForDuplicateDocs})
      setMainData('showDatesDuplicateWindow', false);
      setMainData('goRequestByDuplicateDocs', false); 
    }

  }

  let from = dateNumberToString(datesForDuplicateDocs.dateFrom)
  let to = dateNumberToString(datesForDuplicateDocs.dateTo)
  
  const changeElements = (e: React.FormEvent<HTMLInputElement>, setInterval: Function , datesForDuplicateDocs:DatesForDuplicateDocs) => {
        let target = e.currentTarget;
        let value = target.value;
        let id = target.id;
        let newDatesForDuplicateDocs;

        if (id == 'dateFrom') {
          newDatesForDuplicateDocs = {
            ...datesForDuplicateDocs,
            dateFrom: Date.parse(value)
          }
        } else {
          newDatesForDuplicateDocs = {
            ...datesForDuplicateDocs,
            dateTo: Date.parse(value)
          }
        }
        setDatesForDuplicateDocs(newDatesForDuplicateDocs)
    }

  return (
      <>
          { mainData.window.showDatesDuplicateWindow && 
            <div className={styles.box}>
              <div>Кучириш учун саналарини киритинг</div>
              <div>Нусха олинувчи кун</div>
              <input 
                type='date' 
                className={styles.input} 
                id='dateFrom' 
                value={from}
                onChange={(e) => changeElements(e, setDatesForDuplicateDocs, datesForDuplicateDocs)}
              />
              <div>Нусхани кабул килувчи кун</div>
              <input 
                type='date' 
                className={styles.input} 
                id='dateTo' 
                value={to}
                onChange={(e) => changeElements(e, setDatesForDuplicateDocs, datesForDuplicateDocs)}
              />
              <div className={styles.btnBox}>
                <Button appearance='primary' onClick={() => saveData(datesForDuplicateDocs, setMainData)}> Саклаш </Button>
                <Button appearance='ghost' onClick={() => closeWindow(setMainData)}> Чикиш </Button>
              </div>
            </div>
          }
      </>
  )
}