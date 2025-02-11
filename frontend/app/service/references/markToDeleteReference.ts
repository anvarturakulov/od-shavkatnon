import axios from 'axios';
import { showMessage } from '../common/showMessage';

export const markToDeleteReference = (
  id: string | undefined,
  name: string, setMainData: Function | undefined,
  token: string | undefined
) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  if (id) {
    const uri = process.env.NEXT_PUBLIC_DOMAIN + '/api/reference/markToDelete/' + id;
    axios.delete(uri, config)
      .then(function () {
        if (setMainData) {
          showMessage(`${name} - холати узгартирилди`, 'success', setMainData);
          setMainData('updateDataForRefenceJournal', true);
        }
      })
      .catch(function (error) {
        if (setMainData) {
          showMessage(error.message, 'error', setMainData)
        }
      });
  }
}