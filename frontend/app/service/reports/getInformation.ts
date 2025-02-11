import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { Maindata } from '@/app/context/app.context.interfaces';
import { UserRoles } from '@/app/interfaces/general.interface';

export const getInformation = (
  setMainData: Function | undefined, 
  mainData: Maindata,
  firstPrice: string | null,
  secondPrice: string | null,
  endDate?: number,
  ) => {
  
  const { user, interval, dashboardCurrentReportType } = mainData
  let reportType = dashboardCurrentReportType
  const config = {
    headers: { Authorization: `Bearer ${user?.access_token}` }
  };

  setMainData && setMainData('uploadingDashboard', true)

  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/report/information'+'?startDate='+interval.dateStart+'&endDate='+interval.dateEnd
  +'&reportType='+reportType+'&firstPrice='+firstPrice+'&secondPrice='+secondPrice+'&user='+user?.name;
  console.log('name'+user?.name)

  axios.get(url, config)
    .then(function (response) {
      if (setMainData && !response.data?.user) {
        setMainData('informData', [ ...response.data ]);
        setMainData && setMainData('uploadingDashboard', false)
      }
      if (setMainData && response.data?.user) {
        let activeUser = response.data.user
        let message = `Хозир мен ${activeUser} учун хисобот тайёрлаяпман. Бироз кутиб туринг.`
        setMainData && setMainData('uploadingDashboard', false)
        alert(message)
      }
      
    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });

  setMainData && setMainData('loading', false);

}