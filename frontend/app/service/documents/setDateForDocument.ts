import { Maindata } from '@/app/context/app.context.interfaces';

export const setDateForDocument = ( value: string, setMainData: Function | undefined, mainData: Maindata) => {
  let { currentDocument } = mainData;
  let newObj = {
    ...currentDocument,
    date: Date.parse(value),
  }

  if (setMainData) {
    setMainData('currentDocument', { ...newObj })
  }
}