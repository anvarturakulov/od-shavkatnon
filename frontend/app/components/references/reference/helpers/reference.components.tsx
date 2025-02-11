import { ReferenceModel } from '@/app/interfaces/reference.interface';
import { DataForSelect } from './reference.constants'
import styles from '../reference.module.css';

export const  Select = (list: Array<DataForSelect>, body: ReferenceModel,label: string, typeString: string, changeElement: Function) => {
    
  let currentValue = ''
  if (typeString == 'typeTMZ' && body.typeTMZ) {
    currentValue = body.typeTMZ
  }

  if (typeString == 'typePartners' && body.typePartners) {
    currentValue = body.typePartners
  }
  
  return (
    <div>
      <div className={styles.label}>{label}</div>
      <select
          className={styles.select}
          onChange={(e) => changeElement(e)}
          id={typeString}
      >
          {list.map(elem => {
            return (
              <>
                <option
                  value={elem.name}
                  defaultValue={elem.name}
                  selected = { elem.name == currentValue ? true : false}
                  // selected={false}
                >
                  {elem.title}
                </option>
              </>
            );
          })}
      </select>
    </div>
  )
}
