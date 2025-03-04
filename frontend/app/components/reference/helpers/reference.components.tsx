import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { DataForSelect } from './reference.constants'
import styles from '../reference.module.css';

export const  Select = (list: Array<DataForSelect>, body: ReferenceModel,label: string, typeString: string, changeElement: Function) => {
    
  let currentValue = ''
  if (typeString == 'typeTMZ' && body.refValues?.typeTMZ) {
    currentValue = body.refValues?.typeTMZ
  }

  if (typeString == 'typePartners' && body.refValues?.typePartners) {
    currentValue = body.refValues?.typePartners
  }

  if (typeString == 'typeSection' && body.refValues?.typeSection) {
    currentValue = body.refValues?.typeSection
  }

  return (
    <div>
      <div className={styles.label}>{label}</div>
      <select
          className={styles.select}
          onChange={(e) => changeElement(e)}
          id={typeString}
          value={list[list.findIndex(elem => elem.name == currentValue)].name}
      >
          {list.map((elem, i) => {
            return (
                <option
                  value={elem.name}
                  // defaultValue={elem.name}
                  // selected = { elem.name == currentValue ? true : false}
                  key = {i}
                >
                  {elem.title}
                </option>
            );
          })}
      </select>
    </div>
  )
}
