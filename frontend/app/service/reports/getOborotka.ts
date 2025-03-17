import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { Maindata } from '@/app/context/app.context.interfaces';
import { ReportOptions, Schet } from '@/app/interfaces/report.interface';

export const getOborotka = (
  setMainData: Function | undefined,
  mainData: Maindata
) => {

  const {report, users} = mainData
  const { reportOption } = report;
  const {user} = users

  const { startDate, endDate, schet } = reportOption;

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };
  console.log('Запрос отправлен в - ', Date.now())
  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/reports/oborotka' + '?startDate=' + startDate + '&endDate=' + endDate + '&schet=' + schet;
  axios.get(url, config)
    .then(function (response) {
      if (setMainData) {
        let newReportOptions: ReportOptions = {
          ...reportOption,
          startReport: true,
        }
        console.log('Запрос началь обрабатываться в --', response.data?.startTime)
        console.log('Запрос закончил обработку в --', response.data?.endTime)
        console.log('Ответ пришел в --', Date.now())
        console.log('Ответ пришел в --', Date.now())
        setMainData('reportOption', { ...newReportOptions });
        setMainData('oborotka', response.data);
        setMainData('uploadingDashboard', false);
        console.log('Записал ответ в контекс --', Date.now())
      }

    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });

  console.log('Запрос получен в - ', Date.now())
  setMainData && setMainData('loading', false);

}