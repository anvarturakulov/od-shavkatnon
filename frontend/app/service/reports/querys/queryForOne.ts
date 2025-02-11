


import { Maindata } from '@/app/context/app.context.interfaces';
import { EntryItem, Schet, TypeQuery } from '@/app/interfaces/report.interface';
import axios from 'axios';


export const queryForOne = (
  mainData: Maindata,
  schet: Schet,
  typeQuery: TypeQuery,
  firstSubcontoId: string,
  secondSubcontoId: string,
  endDate: number,
): number => {

  let { user } = mainData;
  endDate = endDate

  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/report/query' +
    '?typeQuery=' + typeQuery + '&schet=' + schet +
    '&startDate=' + 0 + '&endDate=' + endDate +
    '&firstSubcontoId=' + firstSubcontoId + '&secondSubcontoId=' + secondSubcontoId;

  const config = {
    headers: { Authorization: `Bearer ${user?.access_token}` }
  };

  let result = 0;
  axios.get(url, config)
    .then(function (request) {
      result = +request.data
      
    })
    .catch(function (error) {
      // if (setMainData) {
      //   showMessage(error.message, 'error', setMainData)
      // }
    });



  return result
}