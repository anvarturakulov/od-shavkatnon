import { Maindata } from '@/app/context/app.context.interfaces';

export const onChangeInputOptionsBox = (e: React.FormEvent<HTMLInputElement>, setMainData: Function | undefined, mainData: Maindata) => {
  let target = e.currentTarget
  let { reportOption } = mainData;
  let adding: number = target.id == 'endDate' ? 86399999 : 0
  let newObj = {
    ...reportOption,
    [target.id]: Date.parse(target.value) + adding
  }
  // console.log(Date.parse(target.value))
  // console.log(reportOption)
  if (setMainData) {
    setMainData('reportOption', { ...newObj })
  }
}
