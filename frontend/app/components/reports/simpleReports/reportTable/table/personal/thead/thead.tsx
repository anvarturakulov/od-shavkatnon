import styles from './thead.module.css'
import { TheadProps } from './thead.props'

export function Thead ({ className, ...props}:TheadProps ):JSX.Element {
  return (
    <>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.thNumber}>№ </th>
          <th className={styles.name}>ФИШ</th>
          <th className={styles.name}>сана</th>
          <th className={styles.name}>цех</th>
          <th className={styles.name}>изох</th>
          <th className={styles.name}>Колдик сумма</th>
          <th className={styles.name}>Хисобланди</th>
          <th className={styles.name}>Туланди</th>
          <th className={styles.name}>Колдик сумма</th>
        </tr>
      </thead>
    </>
    
  )
}