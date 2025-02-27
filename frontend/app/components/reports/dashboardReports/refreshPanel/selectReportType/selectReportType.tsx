import { SelectReportTypeProps } from './selectReportType.props';
import styles from './selectReportType.module.css';
import { useAppContext } from '@/app/context/app.context';
import cn from 'classnames';
import { Maindata } from '@/app/context/app.context.interfaces';
import { DashboardReportData } from '@/app/data/report';
import { DashboardReportItem } from '@/app/interfaces/report.interface';

export const SelectReportType = ({ className, ...props }: SelectReportTypeProps): JSX.Element => {
    const {mainData, setMainData} = useAppContext();
    const { user } = mainData.users;
    const data = [... DashboardReportData]
    
    const changeElements = (e: React.FormEvent<HTMLSelectElement>, setMainData: Function | undefined, mainData: Maindata) => {
        let target = e.currentTarget;
        let dashboardCurrentReportType = target[target.selectedIndex].getAttribute('data-type');

        if ( setMainData ) {
            setMainData('dashboardCurrentReportType', dashboardCurrentReportType)
        }
    }
 
    return (
        <div className={styles.box}>
            <select
                className={cn(styles.select)}
                {...props}
                onChange={(e) => changeElements(e, setMainData, mainData)}
                defaultValue={'NotSelected'}
            >   
                <option 
                    value={'NotSelected'} 
                    className={cn(styles.option, styles.chooseMe)}
                    data-type='' 
                    key = {'NotSelected'}>
                        {'Хисобот турини танланг'}
                </option>
                {data && data.length>0  &&
                data
                .filter((item:DashboardReportItem) => {
                    if (user) return item.roles.includes(user?.role)
                    return false
                })
                
                .map(( item:DashboardReportItem ) => (
                    <option 
                        className={styles.option}
                        key = {item.code}
                        value={item.title}
                        data-type={item.code}
                        >
                            {item.title}
                    </option>  
                ))}
            </select>
        </div>
    );
};
