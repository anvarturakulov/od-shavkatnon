'use client'
import { DefinedTandirWorkersProps } from './definedTandirWorkers.props';
import styles from './definedTandirWorkers.module.css';
import { useAppContext } from '@/app/context/app.context';
import { SelectWorkers } from './selectWorkers/selectWorkers';
import { UserRoles } from '@/app/interfaces/user.interface';

export const DefinedTandirWorkers = ({className, ...props }: DefinedTandirWorkersProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const {definedTandirWorkers} = mainData.document;

    const role = user?.role;

    return (
        <div className={styles.box}>
            <SelectWorkers 
              label={'Тандирчи'} 
              type='firstWorker'
              currentItemId={definedTandirWorkers?.firstWorker}
              visible={true}
              />   
            
            <SelectWorkers 
              label='Биринчи зувалачи' 
              type='secondWorker'
              currentItemId={definedTandirWorkers?.secondWorker}
              visible={true}
              />   
            
            <SelectWorkers 
              label='Иккинчи зувалачи' 
              type='thirdWorker'
              currentItemId={definedTandirWorkers?.thirdWorker}
              visible={true}
              />   
        </div>   
    )
} 