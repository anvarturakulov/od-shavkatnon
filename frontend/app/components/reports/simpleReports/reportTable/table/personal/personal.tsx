import styles from './personal.module.css'
import { Thead } from './thead/thead';
import { TBody } from './tbody/tbody';
import { PersonalProps } from './personal.props';
import { useAppContext } from '@/app/context/app.context';
import { Schet } from '@/app/interfaces/report.interface';
import { getPropertySubconto } from '@/app/service/reports/getPropertySubconto';
import { ReferenceModel, TypeReference } from '@/app/interfaces/reference.interface';
import { sortByName } from '@/app/service/references/sortByName';

export default function Personal({ className, data, ...props} : PersonalProps):JSX.Element {
    const { setMainData, mainData } = useAppContext()
    const { schet } = mainData.reportOption;
    const { reportOption } = mainData;
    const currentWorkerId = reportOption.firstReferenceId;
    
    return (
        <>
          <table className={styles.table}>
              <Thead/>
              <tbody className={styles.tbody}>
                  {
                  data && 
                  data
                  .filter((item: ReferenceModel) => {
                    return item.typeReference = TypeReference.WORKERS
                  })
                  .filter((item: ReferenceModel) => {
                    if (currentWorkerId) {
                      if (item._id == currentWorkerId) return true
                      else return false
                    } return true
                  })
                  .sort(sortByName)
                  .map((item:ReferenceModel)=>{
                      return (
                          <>
                            <TBody 
                                data={data} 
                                schet={Schet.S67}
                                fixedFirstSuncont = {item._id}
                                bodyByFirstSunconto = {true}
                            />
                          </>
                      )
                  })}

                  
              </tbody>
          </table>
        </>
    )
}
