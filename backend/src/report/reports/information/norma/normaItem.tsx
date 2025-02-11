
import { ReferenceModel, TypeReference, TypeTMZ } from 'src/interfaces/reference.interface';
import { EntryItem, Schet, TypeQuery } from 'src/interfaces/report.interface';
import { query } from 'src/report/helpers/querys/query';
import { queryKor } from 'src/report/helpers/querys/queryKor';

export const normaItem = ( 
  data: any,
  startDate: number,
  endDate: number,
  currentSectionId: string, 
  title: string, 
  globalEntrys: Array<EntryItem> | undefined ) => {    

    let result = []

    const idBuxankaSection = '6604086a3e7f32e728cd6a9d';
    const idZagatovka27 = '659ce9a8523a48fdeb6ad92f';
    const idZagatovka26 = '659cf66e523a48fdeb6ada1a';
    const idZagatovka = currentSectionId == idBuxankaSection ? idZagatovka26 : idZagatovka27;
    const countHamirs = queryKor(Schet.S20, Schet.S21, TypeQuery.OKK, startDate, endDate, currentSectionId, idZagatovka, globalEntrys);
    
    
    data && 
    data.length > 0 &&
    data
    .filter((item: any) => item?.typeTMZ == TypeTMZ.MATERIAL)
    .forEach((item: ReferenceModel) => {

      const rasxod = queryKor(Schet.S20, Schet.S10, TypeQuery.OKK, startDate, endDate, String(currentSectionId), String(item._id), globalEntrys);
      const referenceNorma = item.norma;
      const norma = referenceNorma ? referenceNorma * countHamirs: 0;
      const farq = norma - rasxod;  
      // if (item.norma) {
      //   console.log(String(currentSectionId), String(item._id), startDate, endDate)
      //   console.log(rasxod, referenceNorma, norma, farq)
      // }
                    
      if (rasxod == 0) return {}

      let element = {
        name: item.name,
        rasxod,
        norma,
        farq
      }
      
      if (Object.keys(element).length) {
          result.push(element)
      }
    })
    
    return ( 
        {
          section: title,
          items: result,
          countHamirs
        }
    )
    
} 