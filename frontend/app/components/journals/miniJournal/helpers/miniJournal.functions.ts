import { Maindata } from '@/app/context/app.context.interfaces';
import { setProvodkaToDocument } from '@/app/service/documents/setProvodkaToDocument'

export const setProvodkaByReciever = (id: string | undefined, proveden: boolean | undefined, setMainData: Function | undefined, mainData: Maindata) => {

  if (proveden != undefined && proveden == false) {
    let yes = confirm('Хужжатни кабул киласизми');
    if ( yes ) {
      setProvodkaToDocument(id, setMainData, mainData)
    } 
  }

}