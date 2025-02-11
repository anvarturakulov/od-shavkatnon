import { DataForUserSelect } from './user.constants'
import styles from '../user.module.css';
import { UserModel } from '@/app/interfaces/user.interface';

export const SelectForUser = (list: Array<DataForUserSelect>, body: UserModel,label: string, changeElement: Function) => {
    
  let currentValue = ''
  if (body.role) {
    currentValue = body.role
  }
  
  return (
    <div>
      <div className={styles.label}>{label}</div>
      <select
          className={styles.select}
          onChange={(e) => changeElement(e)}
          id={'role'}
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
