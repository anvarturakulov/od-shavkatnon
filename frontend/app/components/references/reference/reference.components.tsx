import { ReferenceBody } from '@/app/interfaces/reference.interface';
import { DataForSelect } from './reference.constants'
import styles from './reference.module.css';

export const  Select = (list: Array<DataForSelect>, body: ReferenceBody,label: string, typeString: string, changeElement: Function) => {
    
  let currentValue = ''
  if (typeString == 'typeTMZ') {
    currentValue = body.typeTMZ
  }

  if (typeString == 'typePartners') {
    currentValue = body.typePartners
  }
  
  // console.log(typeString+' '+currentValue)
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