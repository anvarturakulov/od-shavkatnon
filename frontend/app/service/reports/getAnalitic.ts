import { showMessage } from '../common/showMessage';
import axios from 'axios';
import { Maindata } from '@/app/context/app.context.interfaces';
import { DEBETKREDIT } from '@/app/interfaces/report.interface';

export const getAnalitic = (
  setMainData: Function | undefined,
  mainData: Maindata,
  firstSubcontoId: string,
  secondSubcontoId: string,
  dk: DEBETKREDIT,
) => {

  const { user } = mainData.users;
  const { reportOption } = mainData.report;
  const { startDate, endDate, schet } = reportOption;

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };
  
  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/reports/analitic' + '?startDate=' + startDate + '&endDate=' + endDate + '&schet=' + schet
  + '&firstSubcontoId=' + firstSubcontoId + '&secondSubcontoId=' + secondSubcontoId + '&dk=' + dk
  ;
  showMessage('Маълумот юкланмокда. Кутуб туринг', 'warm', setMainData)
  axios.get(url, config)
    .then(function (response) {
      if (setMainData) {
        // setMainData('analitic', [...response.data]);
        // console.log('analitic---',response.data)
        showMessage([...response.data], 'success', setMainData)
      }

    })
    .catch(function (error) {
      if (setMainData) {
        showMessage(error.message, 'error', setMainData)
      }
    });

  setMainData && setMainData('loading', false);

}