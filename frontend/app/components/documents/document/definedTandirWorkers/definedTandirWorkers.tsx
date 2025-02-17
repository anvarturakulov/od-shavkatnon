'use client'
import { DefinedTandirWorkersProps } from './definedTandirWorkers.props';
import styles from './definedTandirWorkers.module.css';
import { useAppContext } from '@/app/context/app.context';
import { SelectWorkers } from './selectWorkers/selectWorkers';
import { UserRoles } from '@/app/interfaces/general.interface';

export const DefinedTandirWorkers = ({className, ...props }: DefinedTandirWorkersProps) :JSX.Element => {
    
    const {mainData, setMainData} = useAppContext();
    const {definedTandirWorkers, user} = mainData;
    const role = user?.role;

    return (
        <div className={styles.box}>
            <SelectWorkers 
              label={role == UserRoles.HAMIRCHI ? 'Хамирчи':'Тандирчи'} 
              type='firstWorker'
              currentItemId={definedTandirWorkers?.firstWorker}
              visible={true}
              />   
            
            <SelectWorkers 
              label='Биринчи зувалачи' 
              type='secondWorker'
              currentItemId={definedTandirWorkers?.secondWorker}
              visible={role != UserRoles.HAMIRCHI}
              />   
            
            <SelectWorkers 
              label='Иккинчи зувалачи' 
              type='thirdWorker'
              currentItemId={definedTandirWorkers?.thirdWorker}
              visible={role != UserRoles.HAMIRCHI}
              />   
        </div>   
    )
} 