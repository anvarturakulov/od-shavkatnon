import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { Maindata } from '@/app/context/app.context.interfaces';
import { ReportOptions } from '@/app/interfaces/report.interface';

export const getClients = (
  setMainData: Function | undefined,
  mainData: Maindata
) => {

  const { user } = mainData.users;
  const { reportOption } = mainData.report;
  const { startDate, endDate, firstReferenceId } = reportOption;

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/reports/clients' + '?startDate=' + startDate + '&endDate=' + endDate + '&sectionId=' + firstReferenceId;

  axios.get(url, config)
    .then(function (response) {
      if (setMainData) {
        let newReportOptions: ReportOptions = {
          ...reportOption,
          startReport: true,
        }

        setMainData('reportOption', { ...newReportOptions });
        setMainData('clients', {...response.data});
        setMainData('uploadingDashboard', false);
      }

    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });

  setMainData && setMainData('loading', false);

}