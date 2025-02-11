import { dateNumberToString } from '../common/converterForDates';

export const setTodayToInterval = (setMainData: Function | undefined) => {
  let today = dateNumberToString(0);
  let newInterval = {
    dateStart: Date.parse(today),
    dateEnd: Date.parse(today) + 86399999
  };
  setMainData && setMainData('interval', { ...newInterval })
}