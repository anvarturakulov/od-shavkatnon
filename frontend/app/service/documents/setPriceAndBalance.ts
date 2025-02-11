import { docsDependentToMiddlePrice } from '@/app/components/documents/doc/helpers/documentTypes';
import { Maindata } from '@/app/context/app.context.interfaces';
import { Schet } from '@/app/interfaces/report.interface';
import axios from 'axios';

export const setPriceAndBalance = (
  mainData: Maindata,
  setMainData: Function | undefined,
  schet: Schet,
  firstSubcontoId: string,
  secondSubcontoId: string,
  endDate: number,
  forTable: boolean,
  indexTableItem: number
) => {

  let { user, currentDocument, contentName } = mainData;

  let currentItem = { ...currentDocument }

  if (!firstSubcontoId) firstSubcontoId='';

  let url = process.env.NEXT_PUBLIC_DOMAIN + '/api/report/priceAndBalance' +
    '?&schet=' + schet +'&endDate=' + endDate +
    '&firstSubcontoId=' + firstSubcontoId + 
    '&secondSubcontoId=' + secondSubcontoId;

  const config = {
    headers: { Authorization: `Bearer ${user?.access_token}` }
  };

  axios.get(url, config)
    .then(function (request) {
      let result = {...request.data};
      // console.log(url)
      // console.log(result)
      if (!forTable) {
        currentItem.balance = +result?.balance;
        if (docsDependentToMiddlePrice.includes(contentName)) {
          currentItem.price = result?.price
        }
      } else {
        currentDocument.tableItems[indexTableItem].balance = +result?.balance;
        currentDocument.tableItems[indexTableItem].price = +result?.price;
      }

      if (setMainData) {
        setMainData('currentDocument', {...currentItem})
      }
    })
    .catch(function (error) {
      // if (setMainData) {
      //   showMessage(error.message, 'error', setMainData)
      // }
    });
}