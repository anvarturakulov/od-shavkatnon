import { Maindata } from '@/app/context/app.context.interfaces';

export const onChangeInputOptionsBox = (e: React.FormEvent<HTMLInputElement>, setMainData: Function | undefined, mainData: Maindata) => {
  let target = e.currentTarget
  let { reportOption } = mainData.report;
  let adding: number = target.id == 'endDate' ? 0 : 0
  let newObj = {
    ...reportOption,
    [target.id]: Date.parse(target.value) + adding
  }

  if (setMainData) {
    setMainData('reportOption', { ...newObj })
  }
}
