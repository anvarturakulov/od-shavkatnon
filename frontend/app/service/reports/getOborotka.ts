import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { Maindata } from '@/app/context/app.context.interfaces';
import { ReportOptions, Schet } from '@/app/interfaces/report.interface';

export const getOborotka = (
  setMainData: Function | undefined,
  mainData: Maindata
) => {

  const { user, reportOption } = mainData;
  const { startDate, endDate, firstReferenceId, schet } = reportOption;

  const config = {
    headers: { Authorization: `Bearer ${user?.access_token}` }
  };
  
  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/report/oborotka' + '?startDate=' + startDate + '&endDate=' + endDate + '&schet=' + schet;
  console.log(url)
  axios.get(url, config)
    .then(function (response) {
      if (setMainData) {
        let newReportOptions: ReportOptions = {
          ...reportOption,
          startReport: true,
        }

        setMainData('reportOption', { ...newReportOptions });
        setMainData('oborotka', [...response.data]);
      }

    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });

  setMainData && setMainData('loading', false);

}